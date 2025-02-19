/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 4 -*-
 * vim: set ts=8 sts=4 et sw=4 tw=99:
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "jit/VMFunctions.h"

#include "builtin/TypedObject.h"
#include "frontend/BytecodeCompiler.h"
#include "jit/arm/Simulator-arm.h"
#include "jit/BaselineIC.h"
#include "jit/IonFrames.h"
#include "jit/JitCompartment.h"
#include "jit/mips/Simulator-mips.h"
#include "vm/ArrayObject.h"
#include "vm/Debugger.h"
#include "vm/Interpreter.h"
#include "vm/TraceLogging.h"

#include "jsinferinlines.h"

#include "jit/BaselineFrame-inl.h"
#include "jit/IonFrames-inl.h"
#include "vm/Debugger-inl.h"
#include "vm/Interpreter-inl.h"
#include "vm/NativeObject-inl.h"
#include "vm/StringObject-inl.h"

using namespace js;
using namespace js::jit;

namespace js {
namespace jit {

// Don't explicitly initialize, it's not guaranteed that this initializer will
// run before the constructors for static VMFunctions.
/* static */ VMFunction *VMFunction::functions;

AutoDetectInvalidation::AutoDetectInvalidation(JSContext *cx, MutableHandleValue rval,
                                               IonScript *ionScript)
  : cx_(cx),
    ionScript_(ionScript ? ionScript : GetTopIonJSScript(cx)->ionScript()),
    rval_(rval),
    disabled_(false)
{ }

void
VMFunction::addToFunctions()
{
    static bool initialized = false;
    if (!initialized) {
        initialized = true;
        functions = nullptr;
    }
    this->next = functions;
    functions = this;
}

bool
InvokeFunction(JSContext *cx, HandleObject obj0, uint32_t argc, Value *argv, Value *rval)
{
    RootedObject obj(cx, obj0);
    if (obj->is<JSFunction>()) {
        RootedFunction fun(cx, &obj->as<JSFunction>());
        if (fun->isInterpreted()) {
            if (fun->isInterpretedLazy() && !fun->getOrCreateScript(cx))
                return false;

            // Clone function at call site if needed.
            if (fun->nonLazyScript()->shouldCloneAtCallsite()) {
                jsbytecode *pc;
                RootedScript script(cx, cx->currentScript(&pc));
                fun = CloneFunctionAtCallsite(cx, fun, script, pc);
                if (!fun)
                    return false;
            }
        }
    }

    // Data in the argument vector is arranged for a JIT -> JIT call.
    Value thisv = argv[0];
    Value *argvWithoutThis = argv + 1;

    // For constructing functions, |this| is constructed at caller side and we can just call Invoke.
    // When creating this failed / is impossible at caller site, i.e. MagicValue(JS_IS_CONSTRUCTING),
    // we use InvokeConstructor that creates it at the callee side.
    RootedValue rv(cx);
    if (thisv.isMagic(JS_IS_CONSTRUCTING)) {
        if (!InvokeConstructor(cx, ObjectValue(*obj), argc, argvWithoutThis, &rv))
            return false;
    } else {
        if (!Invoke(cx, thisv, ObjectValue(*obj), argc, argvWithoutThis, &rv))
            return false;
    }

    if (obj->is<JSFunction>()) {
        jsbytecode *pc;
        RootedScript script(cx, cx->currentScript(&pc));
        types::TypeScript::Monitor(cx, script, pc, rv.get());
    }

    *rval = rv;
    return true;
}

JSObject *
NewGCObject(JSContext *cx, gc::AllocKind allocKind, gc::InitialHeap initialHeap)
{
    return js::NewGCObject<CanGC>(cx, allocKind, 0, initialHeap);
}

bool
CheckOverRecursed(JSContext *cx)
{
    // We just failed the jitStackLimit check. There are two possible reasons:
    //  - jitStackLimit was the real stack limit and we're over-recursed
    //  - jitStackLimit was set to UINTPTR_MAX by JSRuntime::requestInterrupt
    //    and we need to call JSRuntime::handleInterrupt.
#if defined(JS_ARM_SIMULATOR) || defined(JS_MIPS_SIMULATOR)
    JS_CHECK_SIMULATOR_RECURSION_WITH_EXTRA(cx, 0, return false);
#else
    JS_CHECK_RECURSION(cx, return false);
#endif
    gc::MaybeVerifyBarriers(cx);
    return cx->runtime()->handleInterrupt(cx);
}

// This function can get called in two contexts.  In the usual context, it's
// called with ealyCheck=false, after the scope chain has been initialized on
// a baseline frame.  In this case, it's ok to throw an exception, so a failed
// stack check returns false, and a successful stack check promps a check for
// an interrupt from the runtime, which may also cause a false return.
//
// In the second case, it's called with earlyCheck=true, prior to frame
// initialization.  An exception cannot be thrown in this instance, so instead
// an error flag is set on the frame and true returned.
bool
CheckOverRecursedWithExtra(JSContext *cx, BaselineFrame *frame,
                           uint32_t extra, uint32_t earlyCheck)
{
    MOZ_ASSERT_IF(earlyCheck, !frame->overRecursed());

    // See |CheckOverRecursed| above.  This is a variant of that function which
    // accepts an argument holding the extra stack space needed for the Baseline
    // frame that's about to be pushed.
    uint8_t spDummy;
    uint8_t *checkSp = (&spDummy) - extra;
    if (earlyCheck) {
#if defined(JS_ARM_SIMULATOR) || defined(JS_MIPS_SIMULATOR)
        (void)checkSp;
        JS_CHECK_SIMULATOR_RECURSION_WITH_EXTRA(cx, extra, frame->setOverRecursed());
#else
        JS_CHECK_RECURSION_WITH_SP(cx, checkSp, frame->setOverRecursed());
#endif
        return true;
    }

    // The OVERRECURSED flag may have already been set on the frame by an
    // early over-recursed check.  If so, throw immediately.
    if (frame->overRecursed())
        return false;

#if defined(JS_ARM_SIMULATOR) || defined(JS_MIPS_SIMULATOR)
    JS_CHECK_SIMULATOR_RECURSION_WITH_EXTRA(cx, extra, return false);
#else
    JS_CHECK_RECURSION_WITH_SP(cx, checkSp, return false);
#endif

    gc::MaybeVerifyBarriers(cx);
    return cx->runtime()->handleInterrupt(cx);
}

bool
DefVarOrConst(JSContext *cx, HandlePropertyName dn, unsigned attrs, HandleObject scopeChain)
{
    // Given the ScopeChain, extract the VarObj.
    RootedObject obj(cx, scopeChain);
    while (!obj->isQualifiedVarObj())
        obj = obj->enclosingScope();

    return DefVarOrConstOperation(cx, obj, dn, attrs);
}

bool
SetConst(JSContext *cx, HandlePropertyName name, HandleObject scopeChain, HandleValue rval)
{
    // Given the ScopeChain, extract the VarObj.
    RootedObject obj(cx, scopeChain);
    while (!obj->isQualifiedVarObj())
        obj = obj->enclosingScope();

    return SetConstOperation(cx, obj, name, rval);
}

bool
MutatePrototype(JSContext *cx, HandleObject obj, HandleValue value)
{
    MOZ_ASSERT(obj->is<JSObject>(), "must only be used with object literals");
    if (!value.isObjectOrNull())
        return true;

    RootedObject newProto(cx, value.toObjectOrNull());

    bool succeeded;
    if (!JSObject::setProto(cx, obj, newProto, &succeeded))
        return false;
    MOZ_ASSERT(succeeded);
    return true;
}

bool
InitProp(JSContext *cx, HandleNativeObject obj, HandlePropertyName name, HandleValue value)
{
    RootedId id(cx, NameToId(name));
    return DefineNativeProperty(cx, obj, id, value, nullptr, nullptr, JSPROP_ENUMERATE);
}

template<bool Equal>
bool
LooselyEqual(JSContext *cx, MutableHandleValue lhs, MutableHandleValue rhs, bool *res)
{
    if (!js::LooselyEqual(cx, lhs, rhs, res))
        return false;
    if (!Equal)
        *res = !*res;
    return true;
}

template bool LooselyEqual<true>(JSContext *cx, MutableHandleValue lhs, MutableHandleValue rhs, bool *res);
template bool LooselyEqual<false>(JSContext *cx, MutableHandleValue lhs, MutableHandleValue rhs, bool *res);

template<bool Equal>
bool
StrictlyEqual(JSContext *cx, MutableHandleValue lhs, MutableHandleValue rhs, bool *res)
{
    if (!js::StrictlyEqual(cx, lhs, rhs, res))
        return false;
    if (!Equal)
        *res = !*res;
    return true;
}

template bool StrictlyEqual<true>(JSContext *cx, MutableHandleValue lhs, MutableHandleValue rhs, bool *res);
template bool StrictlyEqual<false>(JSContext *cx, MutableHandleValue lhs, MutableHandleValue rhs, bool *res);

bool
LessThan(JSContext *cx, MutableHandleValue lhs, MutableHandleValue rhs, bool *res)
{
    return LessThanOperation(cx, lhs, rhs, res);
}

bool
LessThanOrEqual(JSContext *cx, MutableHandleValue lhs, MutableHandleValue rhs, bool *res)
{
    return LessThanOrEqualOperation(cx, lhs, rhs, res);
}

bool
GreaterThan(JSContext *cx, MutableHandleValue lhs, MutableHandleValue rhs, bool *res)
{
    return GreaterThanOperation(cx, lhs, rhs, res);
}

bool
GreaterThanOrEqual(JSContext *cx, MutableHandleValue lhs, MutableHandleValue rhs, bool *res)
{
    return GreaterThanOrEqualOperation(cx, lhs, rhs, res);
}

template<bool Equal>
bool
StringsEqual(JSContext *cx, HandleString lhs, HandleString rhs, bool *res)
{
    if (!js::EqualStrings(cx, lhs, rhs, res))
        return false;
    if (!Equal)
        *res = !*res;
    return true;
}

template bool StringsEqual<true>(JSContext *cx, HandleString lhs, HandleString rhs, bool *res);
template bool StringsEqual<false>(JSContext *cx, HandleString lhs, HandleString rhs, bool *res);

JSObject*
NewInitObject(JSContext *cx, HandleNativeObject templateObject)
{
    NewObjectKind newKind = templateObject->hasSingletonType() ? SingletonObject : GenericObject;
    if (!templateObject->hasLazyType() && templateObject->type()->shouldPreTenure())
        newKind = TenuredObject;
    RootedObject obj(cx, CopyInitializerObject(cx, templateObject, newKind));

    if (!obj)
        return nullptr;

    if (!templateObject->hasSingletonType())
        obj->setType(templateObject->type());

    return obj;
}

JSObject *
NewInitObjectWithClassPrototype(JSContext *cx, HandleObject templateObject)
{
    MOZ_ASSERT(!templateObject->hasSingletonType());
    MOZ_ASSERT(!templateObject->hasLazyType());

    NewObjectKind newKind = templateObject->type()->shouldPreTenure()
                            ? TenuredObject
                            : GenericObject;
    JSObject *obj = NewObjectWithGivenProto(cx,
                                            templateObject->getClass(),
                                            templateObject->getProto(),
                                            cx->global(),
                                            newKind);
    if (!obj)
        return nullptr;

    obj->setType(templateObject->type());

    return obj;
}

bool
ArraySpliceDense(JSContext *cx, HandleObject obj, uint32_t start, uint32_t deleteCount)
{
    JS::AutoValueArray<4> argv(cx);
    argv[0].setUndefined();
    argv[1].setObject(*obj);
    argv[2].set(Int32Value(start));
    argv[3].set(Int32Value(deleteCount));

    return js::array_splice_impl(cx, 2, argv.begin(), false);
}

bool
ArrayPopDense(JSContext *cx, HandleObject obj, MutableHandleValue rval)
{
    MOZ_ASSERT(obj->is<ArrayObject>());

    AutoDetectInvalidation adi(cx, rval);

    JS::AutoValueArray<2> argv(cx);
    argv[0].setUndefined();
    argv[1].setObject(*obj);
    if (!js::array_pop(cx, 0, argv.begin()))
        return false;

    // If the result is |undefined|, the array was probably empty and we
    // have to monitor the return value.
    rval.set(argv[0]);
    if (rval.isUndefined())
        types::TypeScript::Monitor(cx, rval);
    return true;
}

bool
ArrayPushDense(JSContext *cx, HandleArrayObject obj, HandleValue v, uint32_t *length)
{
    if (MOZ_LIKELY(obj->lengthIsWritable())) {
        uint32_t idx = obj->length();
        NativeObject::EnsureDenseResult result = obj->ensureDenseElements(cx, idx, 1);
        if (result == NativeObject::ED_FAILED)
            return false;

        if (result == NativeObject::ED_OK) {
            obj->setDenseElement(idx, v);
            MOZ_ASSERT(idx < INT32_MAX);
            *length = idx + 1;
            obj->setLengthInt32(*length);
            return true;
        }
    }

    JS::AutoValueArray<3> argv(cx);
    argv[0].setUndefined();
    argv[1].setObject(*obj);
    argv[2].set(v);
    if (!js::array_push(cx, 1, argv.begin()))
        return false;

    *length = argv[0].toInt32();
    return true;
}

bool
ArrayShiftDense(JSContext *cx, HandleObject obj, MutableHandleValue rval)
{
    MOZ_ASSERT(obj->is<ArrayObject>());

    AutoDetectInvalidation adi(cx, rval);

    JS::AutoValueArray<2> argv(cx);
    argv[0].setUndefined();
    argv[1].setObject(*obj);
    if (!js::array_shift(cx, 0, argv.begin()))
        return false;

    // If the result is |undefined|, the array was probably empty and we
    // have to monitor the return value.
    rval.set(argv[0]);
    if (rval.isUndefined())
        types::TypeScript::Monitor(cx, rval);
    return true;
}

JSObject *
ArrayConcatDense(JSContext *cx, HandleObject obj1, HandleObject obj2, HandleObject objRes)
{
    Rooted<ArrayObject*> arr1(cx, &obj1->as<ArrayObject>());
    Rooted<ArrayObject*> arr2(cx, &obj2->as<ArrayObject>());
    Rooted<ArrayObject*> arrRes(cx, objRes ? &objRes->as<ArrayObject>() : nullptr);

    if (arrRes) {
        // Fast path if we managed to allocate an object inline.
        if (!js::array_concat_dense(cx, arr1, arr2, arrRes))
            return nullptr;
        return arrRes;
    }

    JS::AutoValueArray<3> argv(cx);
    argv[0].setUndefined();
    argv[1].setObject(*arr1);
    argv[2].setObject(*arr2);
    if (!js::array_concat(cx, 1, argv.begin()))
        return nullptr;
    return &argv[0].toObject();
}

JSString *
ArrayJoin(JSContext *cx, HandleObject array, HandleString sep)
{
    // The annotations in this function follow the first steps of join
    // specified in ES5.

    // Step 1
    RootedObject obj(cx, array);
    if (!obj)
        return nullptr;

    AutoCycleDetector detector(cx, obj);
    if (!detector.init())
        return nullptr;

    if (detector.foundCycle())
        return nullptr;

    // Steps 2 and 3
    uint32_t length;
    if (!GetLengthProperty(cx, obj, &length))
        return nullptr;

    // Steps 4 and 5
    RootedLinearString sepstr(cx);
    if (sep) {
        sepstr = sep->ensureLinear(cx);
        if (!sepstr)
            return nullptr;
    } else {
        sepstr = cx->names().comma;
    }

    // Step 6 to 11
    return js::ArrayJoin<false>(cx, obj, sepstr, length);
}


bool
CharCodeAt(JSContext *cx, HandleString str, int32_t index, uint32_t *code)
{
    char16_t c;
    if (!str->getChar(cx, index, &c))
        return false;
    *code = c;
    return true;
}

JSFlatString *
StringFromCharCode(JSContext *cx, int32_t code)
{
    char16_t c = char16_t(code);

    if (StaticStrings::hasUnit(c))
        return cx->staticStrings().getUnit(c);

    return NewStringCopyN<CanGC>(cx, &c, 1);
}

bool
SetProperty(JSContext *cx, HandleObject obj, HandlePropertyName name, HandleValue value,
            bool strict, jsbytecode *pc)
{
    RootedValue v(cx, value);
    RootedId id(cx, NameToId(name));

    JSOp op = JSOp(*pc);

    if (op == JSOP_SETALIASEDVAR) {
        // Aliased var assigns ignore readonly attributes on the property, as
        // required for initializing 'const' closure variables.
        Shape *shape = obj->as<NativeObject>().lookup(cx, name);
        MOZ_ASSERT(shape && shape->hasSlot());
        obj->as<NativeObject>().setSlotWithType(cx, shape, value);
        return true;
    }

    if (MOZ_LIKELY(!obj->getOps()->setProperty)) {
        return baseops::SetPropertyHelper<SequentialExecution>(
            cx, obj.as<NativeObject>(), obj.as<NativeObject>(), id,
            (op == JSOP_SETNAME || op == JSOP_SETGNAME)
            ? baseops::Unqualified
            : baseops::Qualified,
            &v,
            strict);
    }

    return JSObject::setGeneric(cx, obj, obj, id, &v, strict);
}

bool
InterruptCheck(JSContext *cx)
{
    gc::MaybeVerifyBarriers(cx);

    // Fix loop backedges so that they do not invoke the interrupt again.
    // No lock is held here and it's possible we could segv in the middle here
    // and end up with a state where some fraction of the backedges point to
    // the interrupt handler and some don't. This is ok since the interrupt
    // is definitely about to be handled; if there are still backedges
    // afterwards which point to the interrupt handler, the next time they are
    // taken the backedges will just be reset again.
    cx->runtime()->jitRuntime()->patchIonBackedges(cx->runtime(),
                                                   JitRuntime::BackedgeLoopHeader);

    return CheckForInterrupt(cx);
}

void *
MallocWrapper(JSRuntime *rt, size_t nbytes)
{
    return rt->pod_malloc<uint8_t>(nbytes);
}

JSObject *
NewCallObject(JSContext *cx, HandleShape shape, HandleTypeObject type, uint32_t lexicalBegin)
{
    JSObject *obj = CallObject::create(cx, shape, type, lexicalBegin);
    if (!obj)
        return nullptr;

#ifdef JSGC_GENERATIONAL
    // The JIT creates call objects in the nursery, so elides barriers for
    // the initializing writes. The interpreter, however, may have allocated
    // the call object tenured, so barrier as needed before re-entering.
    if (!IsInsideNursery(obj))
        cx->runtime()->gc.storeBuffer.putWholeCellFromMainThread(obj);
#endif

    return obj;
}

JSObject *
NewSingletonCallObject(JSContext *cx, HandleShape shape, uint32_t lexicalBegin)
{
    JSObject *obj = CallObject::createSingleton(cx, shape, lexicalBegin);
    if (!obj)
        return nullptr;

#ifdef JSGC_GENERATIONAL
    // The JIT creates call objects in the nursery, so elides barriers for
    // the initializing writes. The interpreter, however, may have allocated
    // the call object tenured, so barrier as needed before re-entering.
    MOZ_ASSERT(!IsInsideNursery(obj),
               "singletons are created in the tenured heap");
    cx->runtime()->gc.storeBuffer.putWholeCellFromMainThread(obj);
#endif

    return obj;
}

JSObject *
NewStringObject(JSContext *cx, HandleString str)
{
    return StringObject::create(cx, str);
}

bool
SPSEnter(JSContext *cx, HandleScript script)
{
    return cx->runtime()->spsProfiler.enter(script, script->functionNonDelazifying());
}

bool
SPSExit(JSContext *cx, HandleScript script)
{
    cx->runtime()->spsProfiler.exit(script, script->functionNonDelazifying());
    return true;
}

bool
OperatorIn(JSContext *cx, HandleValue key, HandleObject obj, bool *out)
{
    RootedId id(cx);
    if (!ValueToId<CanGC>(cx, key, &id))
        return false;

    RootedObject obj2(cx);
    RootedShape prop(cx);
    if (!JSObject::lookupGeneric(cx, obj, id, &obj2, &prop))
        return false;

    *out = !!prop;
    return true;
}

bool
OperatorInI(JSContext *cx, uint32_t index, HandleObject obj, bool *out)
{
    RootedValue key(cx, Int32Value(index));
    return OperatorIn(cx, key, obj, out);
}

bool
GetIntrinsicValue(JSContext *cx, HandlePropertyName name, MutableHandleValue rval)
{
    if (!GlobalObject::getIntrinsicValue(cx, cx->global(), name, rval))
        return false;

    // This function is called when we try to compile a cold getintrinsic
    // op. MCallGetIntrinsicValue has an AliasSet of None for optimization
    // purposes, as its side effect is not observable from JS. We are
    // guaranteed to bail out after this function, but because of its AliasSet,
    // type info will not be reflowed. Manually monitor here.
    types::TypeScript::Monitor(cx, rval);

    return true;
}

bool
CreateThis(JSContext *cx, HandleObject callee, MutableHandleValue rval)
{
    rval.set(MagicValue(JS_IS_CONSTRUCTING));

    if (callee->is<JSFunction>()) {
        JSFunction *fun = &callee->as<JSFunction>();
        if (fun->isInterpretedConstructor()) {
            JSScript *script = fun->getOrCreateScript(cx);
            if (!script || !script->ensureHasTypes(cx))
                return false;
            JSObject *thisObj = CreateThisForFunction(cx, callee, GenericObject);
            if (!thisObj)
                return false;
            rval.set(ObjectValue(*thisObj));
        }
    }

    return true;
}

void
GetDynamicName(JSContext *cx, JSObject *scopeChain, JSString *str, Value *vp)
{
    // Lookup a string on the scope chain, returning either the value found or
    // undefined through rval. This function is infallible, and cannot GC or
    // invalidate.

    JSAtom *atom;
    if (str->isAtom()) {
        atom = &str->asAtom();
    } else {
        atom = AtomizeString(cx, str);
        if (!atom) {
            vp->setUndefined();
            return;
        }
    }

    if (!frontend::IsIdentifier(atom) || frontend::IsKeyword(atom)) {
        vp->setUndefined();
        return;
    }

    Shape *shape = nullptr;
    JSObject *scope = nullptr, *pobj = nullptr;
    if (LookupNameNoGC(cx, atom->asPropertyName(), scopeChain, &scope, &pobj, &shape)) {
        if (FetchNameNoGC(pobj, shape, MutableHandleValue::fromMarkedLocation(vp)))
            return;
    }

    vp->setUndefined();
}

bool
FilterArgumentsOrEval(JSContext *cx, JSString *str)
{
    // ensureLinear() is fallible, but cannot GC: it can only allocate a
    // character buffer for the flattened string. If this call fails then the
    // calling Ion code will bailout, resume in Baseline and likely fail again
    // when trying to flatten the string and unwind the stack.
    JS::AutoCheckCannotGC nogc;
    JSLinearString *linear = str->ensureLinear(cx);
    if (!linear)
        return false;

    static const char16_t arguments[] = {'a', 'r', 'g', 'u', 'm', 'e', 'n', 't', 's'};
    static const char16_t eval[] = {'e', 'v', 'a', 'l'};

    return !StringHasPattern(linear, arguments, mozilla::ArrayLength(arguments)) &&
        !StringHasPattern(linear, eval, mozilla::ArrayLength(eval));
}

#ifdef JSGC_GENERATIONAL
void
PostWriteBarrier(JSRuntime *rt, JSObject *obj)
{
    MOZ_ASSERT(!IsInsideNursery(obj));
    rt->gc.storeBuffer.putWholeCellFromMainThread(obj);
}

void
PostGlobalWriteBarrier(JSRuntime *rt, JSObject *obj)
{
    MOZ_ASSERT(obj->is<GlobalObject>());
    if (!obj->compartment()->globalWriteBarriered) {
        PostWriteBarrier(rt, obj);
        obj->compartment()->globalWriteBarriered = true;
    }
}
#endif

uint32_t
GetIndexFromString(JSString *str)
{
    // Masks the return value UINT32_MAX as failure to get the index.
    // I.e. it is impossible to distinguish between failing to get the index
    // or the actual index UINT32_MAX.

    if (!str->isAtom())
        return UINT32_MAX;

    uint32_t index;
    JSAtom *atom = &str->asAtom();
    if (!atom->isIndex(&index))
        return UINT32_MAX;

    return index;
}

bool
DebugPrologue(JSContext *cx, BaselineFrame *frame, jsbytecode *pc, bool *mustReturn)
{
    *mustReturn = false;

    switch (Debugger::onEnterFrame(cx, frame)) {
      case JSTRAP_CONTINUE:
        return true;

      case JSTRAP_RETURN:
        // The script is going to return immediately, so we have to call the
        // debug epilogue handler as well.
        MOZ_ASSERT(frame->hasReturnValue());
        *mustReturn = true;
        return jit::DebugEpilogue(cx, frame, pc, true);

      case JSTRAP_THROW:
      case JSTRAP_ERROR:
        return false;

      default:
        MOZ_CRASH("bad Debugger::onEnterFrame status");
    }
}

bool
DebugEpilogueOnBaselineReturn(JSContext *cx, BaselineFrame *frame, jsbytecode *pc)
{
    if (!DebugEpilogue(cx, frame, pc, true)) {
        // DebugEpilogue popped the frame by updating jitTop, so run the stop event
        // here before we enter the exception handler.
        TraceLogger *logger = TraceLoggerForMainThread(cx->runtime());
        TraceLogStopEvent(logger, TraceLogger::Baseline);
        TraceLogStopEvent(logger); // Leave script.
        return false;
    }

    return true;
}

bool
DebugEpilogue(JSContext *cx, BaselineFrame *frame, jsbytecode *pc, bool ok)
{
    // Unwind scope chain to stack depth 0.
    ScopeIter si(frame, pc, cx);
    UnwindAllScopes(cx, si);
    jsbytecode *unwindPc = frame->script()->main();
    frame->setUnwoundScopeOverridePc(unwindPc);

    // If Debugger::onLeaveFrame returns |true| we have to return the frame's
    // return value. If it returns |false|, the debugger threw an exception.
    // In both cases we have to pop debug scopes.
    ok = Debugger::onLeaveFrame(cx, frame, ok);

    if (frame->isNonEvalFunctionFrame()) {
        MOZ_ASSERT_IF(ok, frame->hasReturnValue());
        DebugScopes::onPopCall(frame, cx);
    } else if (frame->isStrictEvalFrame()) {
        MOZ_ASSERT_IF(frame->hasCallObj(), frame->scopeChain()->as<CallObject>().isForEval());
        DebugScopes::onPopStrictEvalScope(frame);
    }

    // If the frame has a pushed SPS frame, make sure to pop it.
    if (frame->hasPushedSPSFrame()) {
        cx->runtime()->spsProfiler.exit(frame->script(), frame->maybeFun());
        // Unset the pushedSPSFrame flag because DebugEpilogue may get called before
        // probes::ExitScript in baseline during exception handling, and we don't
        // want to double-pop SPS frames.
        frame->unsetPushedSPSFrame();
    }

    if (!ok) {
        // Pop this frame by updating jitTop, so that the exception handling
        // code will start at the previous frame.

        IonJSFrameLayout *prefix = frame->framePrefix();
        EnsureExitFrame(prefix);
        cx->mainThread().jitTop = (uint8_t *)prefix;
    }

    return ok;
}

JSObject *
CreateGenerator(JSContext *cx, BaselineFrame *frame)
{
    return GeneratorObject::create(cx, frame);
}

bool
InitialSuspend(JSContext *cx, HandleObject obj, BaselineFrame *frame, jsbytecode *pc)
{
    MOZ_ASSERT(*pc == JSOP_INITIALYIELD);
    return GeneratorObject::initialSuspend(cx, obj, frame, pc);
}

bool
NormalSuspend(JSContext *cx, HandleObject obj, BaselineFrame *frame, jsbytecode *pc,
              uint32_t stackDepth)
{
    MOZ_ASSERT(*pc == JSOP_YIELD);

    // Return value is still on the stack.
    MOZ_ASSERT(stackDepth >= 1);

    // The expression stack slots are stored on the stack in reverse order, so
    // we copy them to a Vector and pass a pointer to that instead. We use
    // stackDepth - 1 because we don't want to include the return value.
    AutoValueVector exprStack(cx);
    if (!exprStack.reserve(stackDepth - 1))
        return false;

    size_t firstSlot = frame->numValueSlots() - stackDepth;
    for (size_t i = 0; i < stackDepth - 1; i++)
        exprStack.infallibleAppend(*frame->valueSlot(firstSlot + i));

    MOZ_ASSERT(exprStack.length() == stackDepth - 1);

    return GeneratorObject::normalSuspend(cx, obj, frame, pc, exprStack.begin(), stackDepth - 1);
}

bool
FinalSuspend(JSContext *cx, HandleObject obj, BaselineFrame *frame, jsbytecode *pc)
{
    MOZ_ASSERT(*pc == JSOP_FINALYIELDRVAL);

    if (!GeneratorObject::finalSuspend(cx, obj)) {
        // Leave this frame and propagate the exception to the caller.
        return DebugEpilogue(cx, frame, pc, /* ok = */ false);
    }

    return true;
}

bool
StrictEvalPrologue(JSContext *cx, BaselineFrame *frame)
{
    return frame->strictEvalPrologue(cx);
}

bool
HeavyweightFunPrologue(JSContext *cx, BaselineFrame *frame)
{
    return frame->heavyweightFunPrologue(cx);
}

bool
NewArgumentsObject(JSContext *cx, BaselineFrame *frame, MutableHandleValue res)
{
    ArgumentsObject *obj = ArgumentsObject::createExpected(cx, frame);
    if (!obj)
        return false;
    res.setObject(*obj);
    return true;
}

JSObject *
InitRestParameter(JSContext *cx, uint32_t length, Value *rest, HandleObject templateObj,
                  HandleObject objRes)
{
    if (objRes) {
        Rooted<ArrayObject*> arrRes(cx, &objRes->as<ArrayObject>());

        MOZ_ASSERT(!arrRes->getDenseInitializedLength());
        MOZ_ASSERT(arrRes->type() == templateObj->type());

        // Fast path: we managed to allocate the array inline; initialize the
        // slots.
        if (length > 0) {
            if (!arrRes->ensureElements(cx, length))
                return nullptr;
            arrRes->setDenseInitializedLength(length);
            arrRes->initDenseElements(0, rest, length);
            arrRes->setLengthInt32(length);
        }
        return arrRes;
    }

    NewObjectKind newKind = templateObj->type()->shouldPreTenure()
                            ? TenuredObject
                            : GenericObject;
    ArrayObject *arrRes = NewDenseCopiedArray(cx, length, rest, nullptr, newKind);
    if (arrRes)
        arrRes->setType(templateObj->type());
    return arrRes;
}

bool
HandleDebugTrap(JSContext *cx, BaselineFrame *frame, uint8_t *retAddr, bool *mustReturn)
{
    *mustReturn = false;

    RootedScript script(cx, frame->script());
    jsbytecode *pc = script->baselineScript()->icEntryFromReturnAddress(retAddr).pc(script);

    MOZ_ASSERT(cx->compartment()->debugMode());
    MOZ_ASSERT(script->stepModeEnabled() || script->hasBreakpointsAt(pc));

    RootedValue rval(cx);
    JSTrapStatus status = JSTRAP_CONTINUE;

    if (script->stepModeEnabled())
        status = Debugger::onSingleStep(cx, &rval);

    if (status == JSTRAP_CONTINUE && script->hasBreakpointsAt(pc))
        status = Debugger::onTrap(cx, &rval);

    switch (status) {
      case JSTRAP_CONTINUE:
        break;

      case JSTRAP_ERROR:
        return false;

      case JSTRAP_RETURN:
        *mustReturn = true;
        frame->setReturnValue(rval);
        return jit::DebugEpilogue(cx, frame, pc, true);

      case JSTRAP_THROW:
        cx->setPendingException(rval);
        return false;

      default:
        MOZ_CRASH("Invalid trap status");
    }

    return true;
}

bool
OnDebuggerStatement(JSContext *cx, BaselineFrame *frame, jsbytecode *pc, bool *mustReturn)
{
    *mustReturn = false;

    RootedScript script(cx, frame->script());
    RootedValue rval(cx);

    switch (Debugger::onDebuggerStatement(cx, &rval)) {
      case JSTRAP_ERROR:
        return false;

      case JSTRAP_CONTINUE:
        return true;

      case JSTRAP_RETURN:
        frame->setReturnValue(rval);
        *mustReturn = true;
        return jit::DebugEpilogue(cx, frame, pc, true);

      case JSTRAP_THROW:
        cx->setPendingException(rval);
        return false;

      default:
        MOZ_CRASH("Invalid trap status");
    }
}

bool
PushBlockScope(JSContext *cx, BaselineFrame *frame, Handle<StaticBlockObject *> block)
{
    return frame->pushBlock(cx, block);
}

bool
PopBlockScope(JSContext *cx, BaselineFrame *frame)
{
    frame->popBlock(cx);
    return true;
}

bool
DebugLeaveBlock(JSContext *cx, BaselineFrame *frame, jsbytecode *pc)
{
    MOZ_ASSERT(frame->script()->baselineScript()->debugMode());

    DebugScopes::onPopBlock(cx, frame, pc);

    return true;
}

bool
EnterWith(JSContext *cx, BaselineFrame *frame, HandleValue val, Handle<StaticWithObject *> templ)
{
    return EnterWithOperation(cx, frame, val, templ);
}

bool
LeaveWith(JSContext *cx, BaselineFrame *frame)
{
    frame->popWith(cx);
    return true;
}

bool
InitBaselineFrameForOsr(BaselineFrame *frame, InterpreterFrame *interpFrame,
                        uint32_t numStackValues)
{
    return frame->initForOsr(interpFrame, numStackValues);
}

JSObject *
CreateDerivedTypedObj(JSContext *cx, HandleObject descr,
                      HandleObject owner, int32_t offset)
{
    MOZ_ASSERT(descr->is<TypeDescr>());
    MOZ_ASSERT(owner->is<TypedObject>());
    Rooted<TypeDescr*> descr1(cx, &descr->as<TypeDescr>());
    Rooted<TypedObject*> owner1(cx, &owner->as<TypedObject>());
    return OutlineTypedObject::createDerived(cx, descr1, owner1, offset);
}

JSString *
RegExpReplace(JSContext *cx, HandleString string, HandleObject regexp, HandleString repl)
{
    MOZ_ASSERT(string);
    MOZ_ASSERT(repl);

    RootedValue rval(cx);
    if (!str_replace_regexp_raw(cx, string, regexp, repl, &rval))
        return nullptr;

    return rval.toString();
}

JSString *
StringReplace(JSContext *cx, HandleString string, HandleString pattern, HandleString repl)
{
    MOZ_ASSERT(string);
    MOZ_ASSERT(pattern);
    MOZ_ASSERT(repl);

    RootedValue rval(cx);
    if (!str_replace_string_raw(cx, string, pattern, repl, &rval))
        return nullptr;

    return rval.toString();
}

bool
RecompileImpl(JSContext *cx, bool force)
{
    MOZ_ASSERT(cx->currentlyRunningInJit());
    JitActivationIterator activations(cx->runtime());
    JitFrameIterator iter(activations);

    MOZ_ASSERT(iter.type() == JitFrame_Exit);
    ++iter;

    bool isConstructing = iter.isConstructing();
    RootedScript script(cx, iter.script());
    MOZ_ASSERT(script->hasIonScript());

    if (!IsIonEnabled(cx))
        return true;

    MethodStatus status = Recompile(cx, script, nullptr, nullptr, isConstructing, force);
    if (status == Method_Error)
        return false;

    return true;
}

bool
ForcedRecompile(JSContext *cx)
{
    return RecompileImpl(cx, /* force = */ true);
}

bool
Recompile(JSContext *cx)
{
    return RecompileImpl(cx, /* force = */ false);
}

bool
SetDenseElement(JSContext *cx, HandleNativeObject obj, int32_t index, HandleValue value,
                bool strict)
{
    // This function is called from Ion code for StoreElementHole's OOL path.
    // In this case we know the object is native, has no indexed properties
    // and we can use setDenseElement instead of setDenseElementWithType.
    MOZ_ASSERT(!obj->isIndexed());

    NativeObject::EnsureDenseResult result = NativeObject::ED_SPARSE;
    do {
        if (index < 0)
            break;
        bool isArray = obj->is<ArrayObject>();
        if (isArray && !obj->as<ArrayObject>().lengthIsWritable())
            break;
        uint32_t idx = uint32_t(index);
        result = obj->ensureDenseElements(cx, idx, 1);
        if (result != NativeObject::ED_OK)
            break;
        if (isArray) {
            ArrayObject &arr = obj->as<ArrayObject>();
            if (idx >= arr.length())
                arr.setLengthInt32(idx + 1);
        }
        obj->setDenseElement(idx, value);
        return true;
    } while (false);

    if (result == NativeObject::ED_FAILED)
        return false;
    MOZ_ASSERT(result == NativeObject::ED_SPARSE);

    RootedValue indexVal(cx, Int32Value(index));
    return SetObjectElement(cx, obj, indexVal, value, strict);
}

void
AutoDetectInvalidation::setReturnOverride()
{
    cx_->runtime()->jitRuntime()->setIonReturnOverride(rval_.get());
}

#ifdef DEBUG
void
AssertValidObjectPtr(JSContext *cx, JSObject *obj)
{
    // Check what we can, so that we'll hopefully assert/crash if we get a
    // bogus object (pointer).
    MOZ_ASSERT(obj->compartment() == cx->compartment());
    MOZ_ASSERT(obj->runtimeFromMainThread() == cx->runtime());

    MOZ_ASSERT_IF(!obj->hasLazyType(),
                  obj->type()->clasp() == obj->lastProperty()->getObjectClass());

    if (obj->isTenured()) {
        MOZ_ASSERT(obj->isAligned());
        gc::AllocKind kind = obj->asTenured().getAllocKind();
        MOZ_ASSERT(kind >= js::gc::FINALIZE_OBJECT0 && kind <= js::gc::FINALIZE_OBJECT_LAST);
        MOZ_ASSERT(obj->asTenured().zone() == cx->zone());
    }
}

void
AssertValidObjectOrNullPtr(JSContext *cx, JSObject *obj)
{
    if (obj)
        AssertValidObjectPtr(cx, obj);
}

void
AssertValidStringPtr(JSContext *cx, JSString *str)
{
    // We can't closely inspect strings from another runtime.
    if (str->runtimeFromAnyThread() != cx->runtime()) {
        MOZ_ASSERT(str->isPermanentAtom());
        return;
    }

    if (str->isAtom())
        MOZ_ASSERT(cx->runtime()->isAtomsZone(str->zone()));
    else
        MOZ_ASSERT(str->zone() == cx->zone());

    MOZ_ASSERT(str->runtimeFromMainThread() == cx->runtime());
    MOZ_ASSERT(str->isAligned());
    MOZ_ASSERT(str->length() <= JSString::MAX_LENGTH);

    gc::AllocKind kind = str->getAllocKind();
    if (str->isFatInline())
        MOZ_ASSERT(kind == gc::FINALIZE_FAT_INLINE_STRING);
    else if (str->isExternal())
        MOZ_ASSERT(kind == gc::FINALIZE_EXTERNAL_STRING);
    else if (str->isAtom() || str->isFlat())
        MOZ_ASSERT(kind == gc::FINALIZE_STRING || kind == gc::FINALIZE_FAT_INLINE_STRING);
    else
        MOZ_ASSERT(kind == gc::FINALIZE_STRING);
}

void
AssertValidSymbolPtr(JSContext *cx, JS::Symbol *sym)
{
    // We can't closely inspect symbols from another runtime.
    if (sym->runtimeFromAnyThread() != cx->runtime())
        return;

    MOZ_ASSERT(cx->runtime()->isAtomsZone(sym->zone()));

    MOZ_ASSERT(sym->runtimeFromMainThread() == cx->runtime());
    MOZ_ASSERT(sym->isAligned());
    if (JSString *desc = sym->description()) {
        MOZ_ASSERT(desc->isAtom());
        AssertValidStringPtr(cx, desc);
    }

    MOZ_ASSERT(sym->getAllocKind() == gc::FINALIZE_SYMBOL);
}

void
AssertValidValue(JSContext *cx, Value *v)
{
    if (v->isObject())
        AssertValidObjectPtr(cx, &v->toObject());
    else if (v->isString())
        AssertValidStringPtr(cx, v->toString());
    else if (v->isSymbol())
        AssertValidSymbolPtr(cx, v->toSymbol());
}
#endif

// Definition of the MTypedObjectProto MIR.
JSObject *
TypedObjectProto(JSObject *obj)
{
    MOZ_ASSERT(obj->is<TypedObject>());
    TypedObject &typedObj = obj->as<TypedObject>();
    return &typedObj.typedProto();
}

bool
ObjectIsCallable(JSObject *obj)
{
    return obj->isCallable();
}

void
MarkValueFromIon(JSRuntime *rt, Value *vp)
{
    gc::MarkValueUnbarriered(&rt->gc.marker, vp, "write barrier");
}

void
MarkStringFromIon(JSRuntime *rt, JSString **stringp)
{
    if (*stringp)
        gc::MarkStringUnbarriered(&rt->gc.marker, stringp, "write barrier");
}

void
MarkObjectFromIon(JSRuntime *rt, JSObject **objp)
{
    if (*objp)
        gc::MarkObjectUnbarriered(&rt->gc.marker, objp, "write barrier");
}

void
MarkShapeFromIon(JSRuntime *rt, Shape **shapep)
{
    gc::MarkShapeUnbarriered(&rt->gc.marker, shapep, "write barrier");
}

void
MarkTypeObjectFromIon(JSRuntime *rt, types::TypeObject **typep)
{
    gc::MarkTypeObjectUnbarriered(&rt->gc.marker, typep, "write barrier");
}

bool
ThrowUninitializedLexical(JSContext *cx)
{
    ScriptFrameIter iter(cx);
    RootedScript script(cx, iter.script());
    ReportUninitializedLexical(cx, script, iter.pc());
    return false;
}

} // namespace jit
} // namespace js
