/* -*- Mode: C++; tab-width: 20; indent-tabs-mode: nil; c-basic-offset: 2 -*-
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
#include "BorrowedContext.h"
#include "DataSurfaceHelpers.h"
#include "DrawTargetCG.h"
#include "Logging.h"
#include "SourceSurfaceCG.h"
#include "Rect.h"
#include "ScaledFontMac.h"
#include "Tools.h"
#include <vector>
#include <algorithm>
#include "MacIOSurface.h"
#include "FilterNodeSoftware.h"
#include "mozilla/Assertions.h"
#include "mozilla/Types.h" // for decltype
#include "mozilla/FloatingPoint.h"

using namespace std;

//CG_EXTERN void CGContextSetCompositeOperation (CGContextRef, PrivateCGCompositeMode);

// A private API that Cairo has been using for a long time
CG_EXTERN void CGContextSetCTM(CGContextRef, CGAffineTransform);

namespace mozilla {
namespace gfx {

template <typename T>
static CGRect RectToCGRect(const T& r)
{
  return CGRectMake(r.x, r.y, r.width, r.height);
}

CGBlendMode ToBlendMode(CompositionOp op)
{
  CGBlendMode mode;
  switch (op) {
    case CompositionOp::OP_OVER:
      mode = kCGBlendModeNormal;
      break;
    case CompositionOp::OP_ADD:
      mode = kCGBlendModePlusLighter;
      break;
    case CompositionOp::OP_ATOP:
      mode = kCGBlendModeSourceAtop;
      break;
    case CompositionOp::OP_OUT:
      mode = kCGBlendModeSourceOut;
      break;
    case CompositionOp::OP_IN:
      mode = kCGBlendModeSourceIn;
      break;
    case CompositionOp::OP_SOURCE:
      mode = kCGBlendModeCopy;
      break;
    case CompositionOp::OP_DEST_IN:
      mode = kCGBlendModeDestinationIn;
      break;
    case CompositionOp::OP_DEST_OUT:
      mode = kCGBlendModeDestinationOut;
      break;
    case CompositionOp::OP_DEST_OVER:
      mode = kCGBlendModeDestinationOver;
      break;
    case CompositionOp::OP_DEST_ATOP:
      mode = kCGBlendModeDestinationAtop;
      break;
    case CompositionOp::OP_XOR:
      mode = kCGBlendModeXOR;
      break;
    case CompositionOp::OP_MULTIPLY:
      mode = kCGBlendModeMultiply;
      break;
    case CompositionOp::OP_SCREEN:
      mode = kCGBlendModeScreen;
      break;
    case CompositionOp::OP_OVERLAY:
      mode = kCGBlendModeOverlay;
      break;
    case CompositionOp::OP_DARKEN:
      mode = kCGBlendModeDarken;
      break;
    case CompositionOp::OP_LIGHTEN:
      mode = kCGBlendModeLighten;
      break;
    case CompositionOp::OP_COLOR_DODGE:
      mode = kCGBlendModeColorDodge;
      break;
    case CompositionOp::OP_COLOR_BURN:
      mode = kCGBlendModeColorBurn;
      break;
    case CompositionOp::OP_HARD_LIGHT:
      mode = kCGBlendModeHardLight;
      break;
    case CompositionOp::OP_SOFT_LIGHT:
      mode = kCGBlendModeSoftLight;
      break;
    case CompositionOp::OP_DIFFERENCE:
      mode = kCGBlendModeDifference;
      break;
    case CompositionOp::OP_EXCLUSION:
      mode = kCGBlendModeExclusion;
      break;
    case CompositionOp::OP_HUE:
      mode = kCGBlendModeHue;
      break;
    case CompositionOp::OP_SATURATION:
      mode = kCGBlendModeSaturation;
      break;
    case CompositionOp::OP_COLOR:
      mode = kCGBlendModeColor;
      break;
    case CompositionOp::OP_LUMINOSITY:
      mode = kCGBlendModeLuminosity;
      break;
      /*
    case OP_CLEAR:
      mode = kCGBlendModeClear;
      break;*/
    default:
      mode = kCGBlendModeNormal;
  }
  return mode;
}

static CGInterpolationQuality
InterpolationQualityFromFilter(Filter aFilter)
{
  switch (aFilter) {
    default:
    case Filter::LINEAR:
      return kCGInterpolationLow;
    case Filter::POINT:
      return kCGInterpolationNone;
    case Filter::GOOD:
      return kCGInterpolationLow;
  }
}


DrawTargetCG::DrawTargetCG()
  : mColorSpace(nullptr)
  , mCg(nullptr)
  , mMayContainInvalidPremultipliedData(false)
{
}

DrawTargetCG::~DrawTargetCG()
{
  if (mSnapshot) {
    if (mSnapshot->refCount() > 1) {
      // We only need to worry about snapshots that someone else knows about
      mSnapshot->DrawTargetWillGoAway();
    }
    mSnapshot = nullptr;
  }

  // Both of these are OK with nullptr arguments, so we do not
  // need to check (these could be nullptr if Init fails)
  CGColorSpaceRelease(mColorSpace);
  CGContextRelease(mCg);
}

DrawTargetType
DrawTargetCG::GetType() const
{
  return GetBackendType() == BackendType::COREGRAPHICS_ACCELERATED ?
           DrawTargetType::HARDWARE_RASTER : DrawTargetType::SOFTWARE_RASTER;
}

BackendType
DrawTargetCG::GetBackendType() const
{
  // It may be worth spliting Bitmap and IOSurface DrawTarget
  // into seperate classes.
  if (GetContextType(mCg) == CG_CONTEXT_TYPE_IOSURFACE) {
    return BackendType::COREGRAPHICS_ACCELERATED;
  } else {
    return BackendType::COREGRAPHICS;
  }
}

TemporaryRef<SourceSurface>
DrawTargetCG::Snapshot()
{
  if (!mSnapshot) {
    if (GetContextType(mCg) == CG_CONTEXT_TYPE_IOSURFACE) {
      return new SourceSurfaceCGIOSurfaceContext(this);
    }
    Flush();
    mSnapshot = new SourceSurfaceCGBitmapContext(this);
  }

  return mSnapshot;
}

TemporaryRef<DrawTarget>
DrawTargetCG::CreateSimilarDrawTarget(const IntSize &aSize, SurfaceFormat aFormat) const
{
  // XXX: in thebes we use CGLayers to do this kind of thing. It probably makes sense
  // to add that in somehow, but at a higher level
  RefPtr<DrawTargetCG> newTarget = new DrawTargetCG();
  if (newTarget->Init(GetBackendType(), aSize, aFormat)) {
    return newTarget.forget();
  }
  return nullptr;
}

TemporaryRef<SourceSurface>
DrawTargetCG::CreateSourceSurfaceFromData(unsigned char *aData,
                                           const IntSize &aSize,
                                           int32_t aStride,
                                           SurfaceFormat aFormat) const
{
  RefPtr<SourceSurfaceCG> newSurf = new SourceSurfaceCG();

  if (!newSurf->InitFromData(aData, aSize, aStride, aFormat)) {
    return nullptr;
  }

  return newSurf.forget();
}

static void releaseDataSurface(void* info, const void *data, size_t size)
{
  static_cast<DataSourceSurface*>(info)->Release();
}

// This function returns a retained CGImage that needs to be released after
// use. The reason for this is that we want to either reuse an existing CGImage
// or create a new one.
static CGImageRef
GetRetainedImageFromSourceSurface(SourceSurface *aSurface)
{
  switch(aSurface->GetType()) {
    case SurfaceType::COREGRAPHICS_IMAGE:
      return CGImageRetain(static_cast<SourceSurfaceCG*>(aSurface)->GetImage());

    case SurfaceType::COREGRAPHICS_CGCONTEXT:
      return CGImageRetain(static_cast<SourceSurfaceCGContext*>(aSurface)->GetImage());

    default:
    {
      RefPtr<DataSourceSurface> data = aSurface->GetDataSurface();
      if (!data) {
        MOZ_CRASH("unsupported source surface");
      }
      data->AddRef();
      return CreateCGImage(releaseDataSurface, data.get(),
                           data->GetData(), data->GetSize(),
                           data->Stride(), data->GetFormat());
    }
  }
}

TemporaryRef<SourceSurface>
DrawTargetCG::OptimizeSourceSurface(SourceSurface *aSurface) const
{
  return aSurface;
}

class UnboundnessFixer
{
    CGRect mClipBounds;
    CGLayerRef mLayer;
    CGContextRef mCg;
  public:
    UnboundnessFixer() : mCg(nullptr) {}

    CGContextRef Check(CGContextRef baseCg, CompositionOp blend, const Rect* maskBounds = nullptr)
    {
      if (!IsOperatorBoundByMask(blend)) {
        mClipBounds = CGContextGetClipBoundingBox(baseCg);
        // If we're entirely clipped out or if the drawing operation covers the entire clip then
        // we don't need to create a temporary surface.
        if (CGRectIsEmpty(mClipBounds) ||
            (maskBounds && maskBounds->Contains(CGRectToRect(mClipBounds)))) {
          return baseCg;
        }

        // TransparencyLayers aren't blended using the blend mode so
        // we are forced to use CGLayers

        //XXX: The size here is in default user space units, of the layer relative to the graphics context.
        // is the clip bounds still correct if, for example, we have a scale applied to the context?
        mLayer = CGLayerCreateWithContext(baseCg, mClipBounds.size, nullptr);
        mCg = CGLayerGetContext(mLayer);
        // CGContext's default to have the origin at the bottom left
        // so flip it to the top left and adjust for the origin
        // of the layer
        CGContextTranslateCTM(mCg, -mClipBounds.origin.x, mClipBounds.origin.y + mClipBounds.size.height);
        CGContextScaleCTM(mCg, 1, -1);

        return mCg;
      } else {
        return baseCg;
      }
    }

    void Fix(CGContextRef baseCg)
    {
        if (mCg) {
            CGContextTranslateCTM(baseCg, 0, mClipBounds.size.height);
            CGContextScaleCTM(baseCg, 1, -1);
            mClipBounds.origin.y *= -1;
            CGContextDrawLayerAtPoint(baseCg, mClipBounds.origin, mLayer);
            CGContextRelease(mCg);
        }
    }
};

void
DrawTargetCG::DrawSurface(SourceSurface *aSurface,
                           const Rect &aDest,
                           const Rect &aSource,
                           const DrawSurfaceOptions &aSurfOptions,
                           const DrawOptions &aDrawOptions)
{
  MarkChanged();

  CGContextSaveGState(mCg);

  CGContextSetBlendMode(mCg, ToBlendMode(aDrawOptions.mCompositionOp));
  UnboundnessFixer fixer;
  CGContextRef cg = fixer.Check(mCg, aDrawOptions.mCompositionOp, &aDest);
  CGContextSetAlpha(cg, aDrawOptions.mAlpha);
  CGContextSetShouldAntialias(cg, aDrawOptions.mAntialiasMode != AntialiasMode::NONE);

  CGContextConcatCTM(cg, GfxMatrixToCGAffineTransform(mTransform));

  CGContextSetInterpolationQuality(cg, InterpolationQualityFromFilter(aSurfOptions.mFilter));

  CGImageRef image = GetRetainedImageFromSourceSurface(aSurface);

  if (aSurfOptions.mFilter == Filter::POINT) {
    CGImageRef subimage = CGImageCreateWithImageInRect(image, RectToCGRect(aSource));
    CGImageRelease(image);

    CGContextScaleCTM(cg, 1, -1);

    CGRect flippedRect = CGRectMake(aDest.x, -(aDest.y + aDest.height),
                                    aDest.width, aDest.height);

    CGContextDrawImage(cg, flippedRect, subimage);
    CGImageRelease(subimage);
  } else {
    CGRect destRect = CGRectMake(aDest.x, aDest.y, aDest.width, aDest.height);
    CGContextClipToRect(cg, destRect);

    float xScale = aSource.width / aDest.width;
    float yScale = aSource.height / aDest.height;
    CGContextTranslateCTM(cg, aDest.x - aSource.x / xScale, aDest.y - aSource.y / yScale);

    CGRect adjustedDestRect = CGRectMake(0, 0, CGImageGetWidth(image) / xScale,
                                         CGImageGetHeight(image) / yScale);

    CGContextTranslateCTM(cg, 0, CGRectGetHeight(adjustedDestRect));
    CGContextScaleCTM(cg, 1, -1);

    CGContextDrawImage(cg, adjustedDestRect, image);
    CGImageRelease(image);
  }

  fixer.Fix(mCg);

  CGContextRestoreGState(mCg);
}

TemporaryRef<FilterNode>
DrawTargetCG::CreateFilter(FilterType aType)
{
  return FilterNodeSoftware::Create(aType);
}

void
DrawTargetCG::DrawFilter(FilterNode *aNode,
                         const Rect &aSourceRect,
                         const Point &aDestPoint,
                         const DrawOptions &aOptions)
{
  FilterNodeSoftware* filter = static_cast<FilterNodeSoftware*>(aNode);
  filter->Draw(this, aSourceRect, aDestPoint, aOptions);
}

static CGColorRef ColorToCGColor(CGColorSpaceRef aColorSpace, const Color& aColor)
{
  CGFloat components[4] = {aColor.r, aColor.g, aColor.b, aColor.a};
  return CGColorCreate(aColorSpace, components);
}

class GradientStopsCG : public GradientStops
{
  public:
  MOZ_DECLARE_REFCOUNTED_VIRTUAL_TYPENAME(GradientStopsCG)

  GradientStopsCG(CGColorSpaceRef aColorSpace,
                  const std::vector<GradientStop>& aStops,
                  ExtendMode aExtendMode)
    : mGradient(nullptr)
  {
    // This all works fine with empty aStops vector

    mExtend = aExtendMode;
    if (aExtendMode == ExtendMode::CLAMP) {
      size_t numStops = aStops.size();

      std::vector<CGFloat> colors;
      std::vector<CGFloat> offsets;
      colors.reserve(numStops*4);
      offsets.reserve(numStops);

      for (size_t i = 0; i < numStops; i++) {
        colors.push_back(aStops[i].color.r);
        colors.push_back(aStops[i].color.g);
        colors.push_back(aStops[i].color.b);
        colors.push_back(aStops[i].color.a);

        offsets.push_back(aStops[i].offset);
      }

      mGradient = CGGradientCreateWithColorComponents(aColorSpace,
                                                      &colors.front(),
                                                      &offsets.front(),
                                                      offsets.size());
    } else {
      mStops = aStops;
    }

  }

  virtual ~GradientStopsCG() {
    // CGGradientRelease is OK with nullptr argument
    CGGradientRelease(mGradient);
  }

  // Will always report BackendType::COREGRAPHICS, but it is compatible
  // with BackendType::COREGRAPHICS_ACCELERATED
  BackendType GetBackendType() const { return BackendType::COREGRAPHICS; }
  // XXX this should be a union
  CGGradientRef mGradient;
  std::vector<GradientStop> mStops;
  ExtendMode mExtend;
};

TemporaryRef<GradientStops>
DrawTargetCG::CreateGradientStops(GradientStop *aStops, uint32_t aNumStops,
                                  ExtendMode aExtendMode) const
{
  std::vector<GradientStop> stops(aStops, aStops+aNumStops);
  return new GradientStopsCG(mColorSpace, stops, aExtendMode);
}

static void
UpdateLinearParametersToIncludePoint(double *min_t, double *max_t,
                                     CGPoint *start,
                                     double dx, double dy,
                                     double x, double y)
{
  MOZ_ASSERT(IsFinite(x) && IsFinite(y));

  /**
   * Compute a parameter t such that a line perpendicular to the (dx,dy)
   * vector, passing through (start->x + dx*t, start->y + dy*t), also
   * passes through (x,y).
   *
   * Let px = x - start->x, py = y - start->y.
   * t is given by
   *   (px - dx*t)*dx + (py - dy*t)*dy = 0
   *
   * Solving for t we get
   *   numerator = dx*px + dy*py
   *   denominator = dx^2 + dy^2
   *   t = numerator/denominator
   *
   * In CalculateRepeatingGradientParams we know the length of (dx,dy)
   * is not zero. (This is checked in DrawLinearRepeatingGradient.)
   */
  double px = x - start->x;
  double py = y - start->y;
  double numerator = dx * px + dy * py;
  double denominator = dx * dx + dy * dy;
  double t = numerator / denominator;

  if (*min_t > t) {
    *min_t = t;
  }
  if (*max_t < t) {
    *max_t = t;
  }
}

/**
 * Repeat the gradient line such that lines extended perpendicular to the
 * gradient line at both start and end would completely enclose the drawing
 * extents.
 */
static void
CalculateRepeatingGradientParams(CGPoint *aStart, CGPoint *aEnd,
                                 CGRect aExtents, int *aRepeatStartFactor,
                                 int *aRepeatEndFactor)
{
  double t_min = INFINITY;
  double t_max = -INFINITY;
  double dx = aEnd->x - aStart->x;
  double dy = aEnd->y - aStart->y;

  double bounds_x1 = aExtents.origin.x;
  double bounds_y1 = aExtents.origin.y;
  double bounds_x2 = aExtents.origin.x + aExtents.size.width;
  double bounds_y2 = aExtents.origin.y + aExtents.size.height;

  UpdateLinearParametersToIncludePoint(&t_min, &t_max, aStart, dx, dy,
                                       bounds_x1, bounds_y1);
  UpdateLinearParametersToIncludePoint(&t_min, &t_max, aStart, dx, dy,
                                       bounds_x2, bounds_y1);
  UpdateLinearParametersToIncludePoint(&t_min, &t_max, aStart, dx, dy,
                                       bounds_x2, bounds_y2);
  UpdateLinearParametersToIncludePoint(&t_min, &t_max, aStart, dx, dy,
                                       bounds_x1, bounds_y2);

  MOZ_ASSERT(!isinf(t_min) && !isinf(t_max),
             "The first call to UpdateLinearParametersToIncludePoint should have made t_min and t_max non-infinite.");

  // Move t_min and t_max to the nearest usable integer to try to avoid
  // subtle variations due to numerical instability, especially accidentally
  // cutting off a pixel. Extending the gradient repetitions is always safe.
  t_min = floor (t_min);
  t_max = ceil (t_max);
  aEnd->x = aStart->x + dx * t_max;
  aEnd->y = aStart->y + dy * t_max;
  aStart->x = aStart->x + dx * t_min;
  aStart->y = aStart->y + dy * t_min;

  *aRepeatStartFactor = t_min;
  *aRepeatEndFactor = t_max;
}

static CGGradientRef
CreateRepeatingGradient(CGColorSpaceRef aColorSpace,
                        CGContextRef cg, GradientStopsCG* aStops,
                        int aRepeatStartFactor, int aRepeatEndFactor,
                        bool aReflect)
{
  int repeatCount = aRepeatEndFactor - aRepeatStartFactor;
  uint32_t stopCount = aStops->mStops.size();
  double scale = 1./repeatCount;

  std::vector<CGFloat> colors;
  std::vector<CGFloat> offsets;
  colors.reserve(stopCount*repeatCount*4);
  offsets.reserve(stopCount*repeatCount);

  for (int j = aRepeatStartFactor; j < aRepeatEndFactor; j++) {
    bool isReflected = aReflect && (j % 2) != 0;
    for (uint32_t i = 0; i < stopCount; i++) {
      uint32_t stopIndex = isReflected ? stopCount - i - 1 : i;
      colors.push_back(aStops->mStops[stopIndex].color.r);
      colors.push_back(aStops->mStops[stopIndex].color.g);
      colors.push_back(aStops->mStops[stopIndex].color.b);
      colors.push_back(aStops->mStops[stopIndex].color.a);

      CGFloat offset = aStops->mStops[stopIndex].offset;
      if (isReflected) {
        offset = 1 - offset;
      }
      offsets.push_back((offset + (j - aRepeatStartFactor)) * scale);
    }
  }

  CGGradientRef gradient = CGGradientCreateWithColorComponents(aColorSpace,
                                                               &colors.front(),
                                                               &offsets.front(),
                                                               repeatCount*stopCount);
  return gradient;
}

static void
DrawLinearRepeatingGradient(CGColorSpaceRef aColorSpace, CGContextRef cg,
                            const LinearGradientPattern &aPattern,
                            const CGRect &aExtents, bool aReflect)
{
  GradientStopsCG *stops = static_cast<GradientStopsCG*>(aPattern.mStops.get());
  CGPoint startPoint = { aPattern.mBegin.x, aPattern.mBegin.y };
  CGPoint endPoint = { aPattern.mEnd.x, aPattern.mEnd.y };

  int repeatStartFactor = 0, repeatEndFactor = 1;
  // if we don't have a line then we can't extend it
  if (aPattern.mEnd.x != aPattern.mBegin.x ||
      aPattern.mEnd.y != aPattern.mBegin.y) {
    CalculateRepeatingGradientParams(&startPoint, &endPoint, aExtents,
                                     &repeatStartFactor, &repeatEndFactor);
  }

  CGGradientRef gradient = CreateRepeatingGradient(aColorSpace, cg, stops, repeatStartFactor, repeatEndFactor, aReflect);

  CGContextDrawLinearGradient(cg, gradient, startPoint, endPoint,
                              kCGGradientDrawsBeforeStartLocation | kCGGradientDrawsAfterEndLocation);
  CGGradientRelease(gradient);
}

static CGPoint CGRectTopLeft(CGRect a)
{ return a.origin; }
static CGPoint CGRectBottomLeft(CGRect a)
{ return CGPointMake(a.origin.x, a.origin.y + a.size.height); }
static CGPoint CGRectTopRight(CGRect a)
{ return CGPointMake(a.origin.x + a.size.width, a.origin.y); }
static CGPoint CGRectBottomRight(CGRect a)
{ return CGPointMake(a.origin.x + a.size.width, a.origin.y + a.size.height); }

static CGFloat
CGPointDistance(CGPoint a, CGPoint b)
{
  return hypot(a.x-b.x, a.y-b.y);
}

static void
DrawRadialRepeatingGradient(CGColorSpaceRef aColorSpace, CGContextRef cg,
                            const RadialGradientPattern &aPattern,
                            const CGRect &aExtents, bool aReflect)
{
  GradientStopsCG *stops = static_cast<GradientStopsCG*>(aPattern.mStops.get());
  CGPoint startCenter = { aPattern.mCenter1.x, aPattern.mCenter1.y };
  CGFloat startRadius = aPattern.mRadius1;
  CGPoint endCenter   = { aPattern.mCenter2.x, aPattern.mCenter2.y };
  CGFloat endRadius   = aPattern.mRadius2;

  // find the maximum distance from endCenter to a corner of aExtents
  CGFloat minimumEndRadius = endRadius;
  minimumEndRadius = max(minimumEndRadius, CGPointDistance(endCenter, CGRectTopLeft(aExtents)));
  minimumEndRadius = max(minimumEndRadius, CGPointDistance(endCenter, CGRectBottomLeft(aExtents)));
  minimumEndRadius = max(minimumEndRadius, CGPointDistance(endCenter, CGRectTopRight(aExtents)));
  minimumEndRadius = max(minimumEndRadius, CGPointDistance(endCenter, CGRectBottomRight(aExtents)));

  CGFloat length = endRadius - startRadius;
  int repeatStartFactor = 0, repeatEndFactor = 1;
  while (endRadius < minimumEndRadius) {
    endRadius += length;
    repeatEndFactor++;
  }

  while (startRadius-length >= 0) {
    startRadius -= length;
    repeatStartFactor--;
  }

  CGGradientRef gradient = CreateRepeatingGradient(aColorSpace, cg, stops, repeatStartFactor, repeatEndFactor, aReflect);

  //XXX: are there degenerate radial gradients that we should avoid drawing?
  CGContextDrawRadialGradient(cg, gradient, startCenter, startRadius, endCenter, endRadius,
                              kCGGradientDrawsBeforeStartLocation | kCGGradientDrawsAfterEndLocation);
  CGGradientRelease(gradient);
}

static void
DrawGradient(CGColorSpaceRef aColorSpace,
             CGContextRef cg, const Pattern &aPattern, const CGRect &aExtents)
{
  if (CGRectIsEmpty(aExtents)) {
    return;
  }

  if (aPattern.GetType() == PatternType::LINEAR_GRADIENT) {
    const LinearGradientPattern& pat = static_cast<const LinearGradientPattern&>(aPattern);
    GradientStopsCG *stops = static_cast<GradientStopsCG*>(pat.mStops.get());
    CGAffineTransform patternMatrix = GfxMatrixToCGAffineTransform(pat.mMatrix);
    CGContextConcatCTM(cg, patternMatrix);
    CGRect extents = CGRectApplyAffineTransform(aExtents, CGAffineTransformInvert(patternMatrix));
    if (stops->mExtend == ExtendMode::CLAMP) {

      // XXX: we should take the m out of the properties of LinearGradientPatterns
      CGPoint startPoint = { pat.mBegin.x, pat.mBegin.y };
      CGPoint endPoint   = { pat.mEnd.x,   pat.mEnd.y };

      // Canvas spec states that we should avoid drawing degenerate gradients (XXX: should this be in common code?)
      //if (startPoint.x == endPoint.x && startPoint.y == endPoint.y)
      //  return;

      CGContextDrawLinearGradient(cg, stops->mGradient, startPoint, endPoint,
                                  kCGGradientDrawsBeforeStartLocation | kCGGradientDrawsAfterEndLocation);
    } else if (stops->mExtend == ExtendMode::REPEAT || stops->mExtend == ExtendMode::REFLECT) {
      DrawLinearRepeatingGradient(aColorSpace, cg, pat, extents, stops->mExtend == ExtendMode::REFLECT);
    }
  } else if (aPattern.GetType() == PatternType::RADIAL_GRADIENT) {
    const RadialGradientPattern& pat = static_cast<const RadialGradientPattern&>(aPattern);
    CGAffineTransform patternMatrix = GfxMatrixToCGAffineTransform(pat.mMatrix);
    CGContextConcatCTM(cg, patternMatrix);
    CGRect extents = CGRectApplyAffineTransform(aExtents, CGAffineTransformInvert(patternMatrix));
    GradientStopsCG *stops = static_cast<GradientStopsCG*>(pat.mStops.get());
    if (stops->mExtend == ExtendMode::CLAMP) {

      // XXX: we should take the m out of the properties of RadialGradientPatterns
      CGPoint startCenter = { pat.mCenter1.x, pat.mCenter1.y };
      CGFloat startRadius = pat.mRadius1;
      CGPoint endCenter   = { pat.mCenter2.x, pat.mCenter2.y };
      CGFloat endRadius   = pat.mRadius2;

      //XXX: are there degenerate radial gradients that we should avoid drawing?
      CGContextDrawRadialGradient(cg, stops->mGradient, startCenter, startRadius, endCenter, endRadius,
                                  kCGGradientDrawsBeforeStartLocation | kCGGradientDrawsAfterEndLocation);
    } else if (stops->mExtend == ExtendMode::REPEAT || stops->mExtend == ExtendMode::REFLECT) {
      DrawRadialRepeatingGradient(aColorSpace, cg, pat, extents, stops->mExtend == ExtendMode::REFLECT);
    }
  } else {
    assert(0);
  }

}

static void
drawPattern(void *info, CGContextRef context)
{
  CGImageRef image = static_cast<CGImageRef>(info);
  CGRect rect = {{0, 0},
    {static_cast<CGFloat>(CGImageGetWidth(image)),
     static_cast<CGFloat>(CGImageGetHeight(image))}};
  CGContextDrawImage(context, rect, image);
}

static void
releaseInfo(void *info)
{
  CGImageRef image = static_cast<CGImageRef>(info);
  CGImageRelease(image);
}

CGPatternCallbacks patternCallbacks = {
  0,
  drawPattern,
  releaseInfo
};

static bool
isGradient(const Pattern &aPattern)
{
  return aPattern.GetType() == PatternType::LINEAR_GRADIENT || aPattern.GetType() == PatternType::RADIAL_GRADIENT;
}

static bool
isNonRepeatingSurface(const Pattern& aPattern)
{
  return aPattern.GetType() == PatternType::SURFACE &&
    static_cast<const SurfacePattern&>(aPattern).mExtendMode != ExtendMode::REPEAT;
}

/* CoreGraphics patterns ignore the userspace transform so
 * we need to multiply it in */
static CGPatternRef
CreateCGPattern(const Pattern &aPattern, CGAffineTransform aUserSpace)
{
  const SurfacePattern& pat = static_cast<const SurfacePattern&>(aPattern);
  // XXX: is .get correct here?
  CGImageRef image = GetRetainedImageFromSourceSurface(pat.mSurface.get());
  Matrix patTransform = pat.mMatrix;
  if (!pat.mSamplingRect.IsEmpty()) {
    CGImageRef temp = CGImageCreateWithImageInRect(image, RectToCGRect(pat.mSamplingRect));
    CGImageRelease(image);
    image = temp;
    patTransform.PreTranslate(pat.mSamplingRect.x, pat.mSamplingRect.y);
  }
  CGFloat xStep, yStep;
  switch (pat.mExtendMode) {
    case ExtendMode::CLAMP:
      // The 1 << 22 comes from Webkit see Pattern::createPlatformPattern() in PatternCG.cpp for more info
      xStep = static_cast<CGFloat>(1 << 22);
      yStep = static_cast<CGFloat>(1 << 22);
      break;
    case ExtendMode::REFLECT:
      assert(0);
    case ExtendMode::REPEAT:
      xStep = static_cast<CGFloat>(CGImageGetWidth(image));
      yStep = static_cast<CGFloat>(CGImageGetHeight(image));
      // webkit uses wkCGPatternCreateWithImageAndTransform a wrapper around CGPatternCreateWithImage2
      // this is done to avoid pixel-cracking along pattern boundaries
      // (see https://bugs.webkit.org/show_bug.cgi?id=53055)
      // typedef enum {
      //    wkPatternTilingNoDistortion,
      //    wkPatternTilingConstantSpacingMinimalDistortion,
      //    wkPatternTilingConstantSpacing
      // } wkPatternTiling;
      // extern CGPatternRef (*wkCGPatternCreateWithImageAndTransform)(CGImageRef, CGAffineTransform, int);
  }

  //XXX: We should be using CGContextDrawTiledImage when we can. Even though it
  // creates a pattern, it seems to go down a faster path than using a delegate
  // like we do below
  CGRect bounds = {
    {0, 0,},
    {static_cast<CGFloat>(CGImageGetWidth(image)), static_cast<CGFloat>(CGImageGetHeight(image))}
  };
  CGAffineTransform transform =
      CGAffineTransformConcat(CGAffineTransformConcat(CGAffineTransformMakeScale(1,
                                                                                 -1),
                                                      GfxMatrixToCGAffineTransform(patTransform)),
                              aUserSpace);
  transform = CGAffineTransformTranslate(transform, 0, -static_cast<float>(CGImageGetHeight(image)));
  return CGPatternCreate(image, bounds, transform, xStep, yStep, kCGPatternTilingConstantSpacing,
                         true, &patternCallbacks);
}

static void
SetFillFromPattern(CGContextRef cg, CGColorSpaceRef aColorSpace, const Pattern &aPattern)
{
  assert(!isGradient(aPattern));
  if (aPattern.GetType() == PatternType::COLOR) {

    const Color& color = static_cast<const ColorPattern&>(aPattern).mColor;
    //XXX: we should cache colors
    CGColorRef cgcolor = ColorToCGColor(aColorSpace, color);
    CGContextSetFillColorWithColor(cg, cgcolor);
    CGColorRelease(cgcolor);
  } else if (aPattern.GetType() == PatternType::SURFACE) {

    CGColorSpaceRef patternSpace;
    patternSpace = CGColorSpaceCreatePattern (nullptr);
    CGContextSetFillColorSpace(cg, patternSpace);
    CGColorSpaceRelease(patternSpace);

    CGPatternRef pattern = CreateCGPattern(aPattern, CGContextGetCTM(cg));
    const SurfacePattern& pat = static_cast<const SurfacePattern&>(aPattern);
    CGContextSetInterpolationQuality(cg, InterpolationQualityFromFilter(pat.mFilter));
    CGFloat alpha = 1.;
    CGContextSetFillPattern(cg, pattern, &alpha);
    CGPatternRelease(pattern);
  }
}

static void
SetStrokeFromPattern(CGContextRef cg, CGColorSpaceRef aColorSpace, const Pattern &aPattern)
{
  assert(!isGradient(aPattern));
  if (aPattern.GetType() == PatternType::COLOR) {
    const Color& color = static_cast<const ColorPattern&>(aPattern).mColor;
    //XXX: we should cache colors
    CGColorRef cgcolor = ColorToCGColor(aColorSpace, color);
    CGContextSetStrokeColorWithColor(cg, cgcolor);
    CGColorRelease(cgcolor);
  } else if (aPattern.GetType() == PatternType::SURFACE) {
    CGColorSpaceRef patternSpace;
    patternSpace = CGColorSpaceCreatePattern (nullptr);
    CGContextSetStrokeColorSpace(cg, patternSpace);
    CGColorSpaceRelease(patternSpace);

    CGPatternRef pattern = CreateCGPattern(aPattern, CGContextGetCTM(cg));
    const SurfacePattern& pat = static_cast<const SurfacePattern&>(aPattern);
    CGContextSetInterpolationQuality(cg, InterpolationQualityFromFilter(pat.mFilter));
    CGFloat alpha = 1.;
    CGContextSetStrokePattern(cg, pattern, &alpha);
    CGPatternRelease(pattern);
  }

}

void
DrawTargetCG::MaskSurface(const Pattern &aSource,
                          SourceSurface *aMask,
                          Point aOffset,
                          const DrawOptions &aDrawOptions)
{
  MarkChanged();

  CGContextSaveGState(mCg);

  CGContextSetBlendMode(mCg, ToBlendMode(aDrawOptions.mCompositionOp));
  UnboundnessFixer fixer;
  CGContextRef cg = fixer.Check(mCg, aDrawOptions.mCompositionOp);
  CGContextSetAlpha(cg, aDrawOptions.mAlpha);
  CGContextSetShouldAntialias(cg, aDrawOptions.mAntialiasMode != AntialiasMode::NONE);

  CGContextConcatCTM(cg, GfxMatrixToCGAffineTransform(mTransform));
  CGImageRef image = GetRetainedImageFromSourceSurface(aMask);

  // use a negative-y so that the mask image draws right ways up
  CGContextScaleCTM(cg, 1, -1);

  IntSize size = aMask->GetSize();

  CGContextClipToMask(cg, CGRectMake(aOffset.x, -(aOffset.y + size.height), size.width, size.height), image);

  CGContextScaleCTM(cg, 1, -1);
  if (isGradient(aSource)) {
    // we shouldn't need to clip to an additional rectangle
    // as the cliping to the mask should be sufficient.
    DrawGradient(mColorSpace, cg, aSource, CGRectMake(aOffset.x, aOffset.y, size.width, size.height));
  } else {
    SetFillFromPattern(cg, mColorSpace, aSource);
    CGContextFillRect(cg, CGRectMake(aOffset.x, aOffset.y, size.width, size.height));
  }

  CGImageRelease(image);

  fixer.Fix(mCg);

  CGContextRestoreGState(mCg);
}



void
DrawTargetCG::FillRect(const Rect &aRect,
                       const Pattern &aPattern,
                       const DrawOptions &aDrawOptions)
{
  MarkChanged();

  CGContextSaveGState(mCg);

  UnboundnessFixer fixer;
  CGContextRef cg = fixer.Check(mCg, aDrawOptions.mCompositionOp, &aRect);
  CGContextSetAlpha(mCg, aDrawOptions.mAlpha);
  CGContextSetShouldAntialias(cg, aDrawOptions.mAntialiasMode != AntialiasMode::NONE);
  CGContextSetBlendMode(mCg, ToBlendMode(aDrawOptions.mCompositionOp));

  CGContextConcatCTM(cg, GfxMatrixToCGAffineTransform(mTransform));

  if (isGradient(aPattern)) {
    CGContextClipToRect(cg, RectToCGRect(aRect));
    CGRect clipBounds = CGContextGetClipBoundingBox(cg);
    DrawGradient(mColorSpace, cg, aPattern, clipBounds);
  } else if (isNonRepeatingSurface(aPattern)) {
    // SetFillFromPattern can handle this case but using CGContextDrawImage
    // should give us better performance, better output, smaller PDF and
    // matches what cairo does.
    const SurfacePattern& pat = static_cast<const SurfacePattern&>(aPattern);
    CGImageRef image = GetRetainedImageFromSourceSurface(pat.mSurface.get());
    Matrix transform = pat.mMatrix;
    if (!pat.mSamplingRect.IsEmpty()) {
      CGImageRef temp = CGImageCreateWithImageInRect(image, RectToCGRect(pat.mSamplingRect));
      CGImageRelease(image);
      image = temp;
      transform.PreTranslate(pat.mSamplingRect.x, pat.mSamplingRect.y);
    }
    CGContextClipToRect(cg, RectToCGRect(aRect));
    CGContextConcatCTM(cg, GfxMatrixToCGAffineTransform(transform));
    CGContextTranslateCTM(cg, 0, CGImageGetHeight(image));
    CGContextScaleCTM(cg, 1, -1);

    CGRect imageRect = CGRectMake(0, 0, CGImageGetWidth(image), CGImageGetHeight(image));

    CGContextSetInterpolationQuality(cg, InterpolationQualityFromFilter(pat.mFilter));

    CGContextDrawImage(cg, imageRect, image);
    CGImageRelease(image);
  } else {
    SetFillFromPattern(cg, mColorSpace, aPattern);
    CGContextFillRect(cg, RectToCGRect(aRect));
  }

  fixer.Fix(mCg);
  CGContextRestoreGState(mCg);
}

void
DrawTargetCG::StrokeLine(const Point &p1, const Point &p2, const Pattern &aPattern, const StrokeOptions &aStrokeOptions, const DrawOptions &aDrawOptions)
{
  if (!std::isfinite(p1.x) ||
      !std::isfinite(p1.y) ||
      !std::isfinite(p2.x) ||
      !std::isfinite(p2.y)) {
    return;
  }

  MarkChanged();

  CGContextSaveGState(mCg);

  UnboundnessFixer fixer;
  CGContextRef cg = fixer.Check(mCg, aDrawOptions.mCompositionOp);
  CGContextSetAlpha(mCg, aDrawOptions.mAlpha);
  CGContextSetShouldAntialias(cg, aDrawOptions.mAntialiasMode != AntialiasMode::NONE);
  CGContextSetBlendMode(mCg, ToBlendMode(aDrawOptions.mCompositionOp));

  CGContextConcatCTM(cg, GfxMatrixToCGAffineTransform(mTransform));

  CGContextBeginPath(cg);
  CGContextMoveToPoint(cg, p1.x, p1.y);
  CGContextAddLineToPoint(cg, p2.x, p2.y);

  SetStrokeOptions(cg, aStrokeOptions);

  if (isGradient(aPattern)) {
    CGContextReplacePathWithStrokedPath(cg);
    CGRect extents = CGContextGetPathBoundingBox(cg);
    //XXX: should we use EO clip here?
    CGContextClip(cg);
    DrawGradient(mColorSpace, cg, aPattern, extents);
  } else {
    SetStrokeFromPattern(cg, mColorSpace, aPattern);
    CGContextStrokePath(cg);
  }

  fixer.Fix(mCg);
  CGContextRestoreGState(mCg);
}

void
DrawTargetCG::StrokeRect(const Rect &aRect,
                         const Pattern &aPattern,
                         const StrokeOptions &aStrokeOptions,
                         const DrawOptions &aDrawOptions)
{
  if (!aRect.IsFinite()) {
    return;
  }

  MarkChanged();

  CGContextSaveGState(mCg);

  UnboundnessFixer fixer;
  CGContextRef cg = fixer.Check(mCg, aDrawOptions.mCompositionOp);
  CGContextSetAlpha(mCg, aDrawOptions.mAlpha);
  CGContextSetShouldAntialias(cg, aDrawOptions.mAntialiasMode != AntialiasMode::NONE);
  CGContextSetBlendMode(mCg, ToBlendMode(aDrawOptions.mCompositionOp));

  CGContextConcatCTM(cg, GfxMatrixToCGAffineTransform(mTransform));

  SetStrokeOptions(cg, aStrokeOptions);

  if (isGradient(aPattern)) {
    // There's no CGContextClipStrokeRect so we do it by hand
    CGContextBeginPath(cg);
    CGContextAddRect(cg, RectToCGRect(aRect));
    CGContextReplacePathWithStrokedPath(cg);
    CGRect extents = CGContextGetPathBoundingBox(cg);
    //XXX: should we use EO clip here?
    CGContextClip(cg);
    DrawGradient(mColorSpace, cg, aPattern, extents);
  } else {
    SetStrokeFromPattern(cg, mColorSpace, aPattern);
    CGContextStrokeRect(cg, RectToCGRect(aRect));
  }

  fixer.Fix(mCg);
  CGContextRestoreGState(mCg);
}


void
DrawTargetCG::ClearRect(const Rect &aRect)
{
  MarkChanged();

  CGContextSaveGState(mCg);
  CGContextConcatCTM(mCg, GfxMatrixToCGAffineTransform(mTransform));

  CGContextClearRect(mCg, RectToCGRect(aRect));

  CGContextRestoreGState(mCg);
}

void
DrawTargetCG::Stroke(const Path *aPath, const Pattern &aPattern, const StrokeOptions &aStrokeOptions, const DrawOptions &aDrawOptions)
{
  if (!aPath->GetBounds().IsFinite()) {
    return;
  }

  MarkChanged();

  CGContextSaveGState(mCg);

  UnboundnessFixer fixer;
  CGContextRef cg = fixer.Check(mCg, aDrawOptions.mCompositionOp);
  CGContextSetAlpha(mCg, aDrawOptions.mAlpha);
  CGContextSetShouldAntialias(cg, aDrawOptions.mAntialiasMode != AntialiasMode::NONE);
  CGContextSetBlendMode(mCg, ToBlendMode(aDrawOptions.mCompositionOp));

  CGContextConcatCTM(cg, GfxMatrixToCGAffineTransform(mTransform));


  CGContextBeginPath(cg);

  assert(aPath->GetBackendType() == BackendType::COREGRAPHICS);
  const PathCG *cgPath = static_cast<const PathCG*>(aPath);
  CGContextAddPath(cg, cgPath->GetPath());

  SetStrokeOptions(cg, aStrokeOptions);

  if (isGradient(aPattern)) {
    CGContextReplacePathWithStrokedPath(cg);
    CGRect extents = CGContextGetPathBoundingBox(cg);
    //XXX: should we use EO clip here?
    CGContextClip(cg);
    DrawGradient(mColorSpace, cg, aPattern, extents);
  } else {
    // XXX: we could put fill mode into the path fill rule if we wanted

    SetStrokeFromPattern(cg, mColorSpace, aPattern);
    CGContextStrokePath(cg);
  }

  fixer.Fix(mCg);
  CGContextRestoreGState(mCg);
}

void
DrawTargetCG::Fill(const Path *aPath, const Pattern &aPattern, const DrawOptions &aDrawOptions)
{
  MarkChanged();

  assert(aPath->GetBackendType() == BackendType::COREGRAPHICS);

  CGContextSaveGState(mCg);

  CGContextSetBlendMode(mCg, ToBlendMode(aDrawOptions.mCompositionOp));
  UnboundnessFixer fixer;
  CGContextRef cg = fixer.Check(mCg, aDrawOptions.mCompositionOp);
  CGContextSetAlpha(cg, aDrawOptions.mAlpha);
  CGContextSetShouldAntialias(cg, aDrawOptions.mAntialiasMode != AntialiasMode::NONE);

  CGContextConcatCTM(cg, GfxMatrixToCGAffineTransform(mTransform));

  CGContextBeginPath(cg);
  // XXX: we could put fill mode into the path fill rule if we wanted
  const PathCG *cgPath = static_cast<const PathCG*>(aPath);

  if (isGradient(aPattern)) {
    // setup a clip to draw the gradient through
    CGRect extents;
    if (CGPathIsEmpty(cgPath->GetPath())) {
      // Adding an empty path will cause us not to clip
      // so clip everything explicitly
      CGContextClipToRect(mCg, CGRectZero);
      extents = CGRectZero;
    } else {
      CGContextAddPath(cg, cgPath->GetPath());
      extents = CGContextGetPathBoundingBox(cg);
      if (cgPath->GetFillRule() == FillRule::FILL_EVEN_ODD)
        CGContextEOClip(mCg);
      else
        CGContextClip(mCg);
    }

    DrawGradient(mColorSpace, cg, aPattern, extents);
  } else {
    CGContextAddPath(cg, cgPath->GetPath());

    SetFillFromPattern(cg, mColorSpace, aPattern);

    if (cgPath->GetFillRule() == FillRule::FILL_EVEN_ODD)
      CGContextEOFillPath(cg);
    else
      CGContextFillPath(cg);
  }

  fixer.Fix(mCg);
  CGContextRestoreGState(mCg);
}

CGRect ComputeGlyphsExtents(CGRect *bboxes, CGPoint *positions, CFIndex count, float scale)
{
  CGFloat x1, x2, y1, y2;
  if (count < 1)
    return CGRectZero;

  x1 = bboxes[0].origin.x + positions[0].x;
  x2 = bboxes[0].origin.x + positions[0].x + scale*bboxes[0].size.width;
  y1 = bboxes[0].origin.y + positions[0].y;
  y2 = bboxes[0].origin.y + positions[0].y + scale*bboxes[0].size.height;

  // accumulate max and minimum coordinates
  for (int i = 1; i < count; i++) {
    x1 = min(x1, bboxes[i].origin.x + positions[i].x);
    y1 = min(y1, bboxes[i].origin.y + positions[i].y);
    x2 = max(x2, bboxes[i].origin.x + positions[i].x + scale*bboxes[i].size.width);
    y2 = max(y2, bboxes[i].origin.y + positions[i].y + scale*bboxes[i].size.height);
  }

  CGRect extents = {{x1, y1}, {x2-x1, y2-y1}};
  return extents;
}

typedef void (*CGContextSetFontSmoothingBackgroundColorFunc) (CGContextRef cgContext, CGColorRef color);

static CGContextSetFontSmoothingBackgroundColorFunc
GetCGContextSetFontSmoothingBackgroundColorFunc()
{
  static CGContextSetFontSmoothingBackgroundColorFunc func = nullptr;
  static bool lookedUpFunc = false;
  if (!lookedUpFunc) {
    func = (CGContextSetFontSmoothingBackgroundColorFunc)dlsym(
      RTLD_DEFAULT, "CGContextSetFontSmoothingBackgroundColor");
    lookedUpFunc = true;
  }
  return func;
}

void
DrawTargetCG::FillGlyphs(ScaledFont *aFont, const GlyphBuffer &aBuffer, const Pattern &aPattern, const DrawOptions &aDrawOptions,
                         const GlyphRenderingOptions *aGlyphRenderingOptions)
{
  MarkChanged();

  assert(aBuffer.mNumGlyphs);
  CGContextSaveGState(mCg);

  if (aGlyphRenderingOptions && aGlyphRenderingOptions->GetType() == FontType::MAC) {
    Color fontSmoothingBackgroundColor =
      static_cast<const GlyphRenderingOptionsCG*>(aGlyphRenderingOptions)->FontSmoothingBackgroundColor();
    if (fontSmoothingBackgroundColor.a > 0) {
      CGContextSetFontSmoothingBackgroundColorFunc setFontSmoothingBGColorFunc =
        GetCGContextSetFontSmoothingBackgroundColorFunc();
      if (setFontSmoothingBGColorFunc) {
        CGColorRef color = ColorToCGColor(mColorSpace, fontSmoothingBackgroundColor);
        setFontSmoothingBGColorFunc(mCg, color);
        CGColorRelease(color);

        // Font rendering with a non-transparent font smoothing background color
        // can leave pixels in our buffer where the rgb components exceed the alpha
        // component. When this happens we need to clean up the data afterwards.
        // The purpose of this is probably the following: Correct compositing of
        // subpixel anti-aliased fonts on transparent backgrounds requires
        // different alpha values per RGB component. Usually, premultiplied color
        // values are derived by multiplying all components with the same per-pixel
        // alpha value. However, if you multiply each component with a *different*
        // alpha, and set the alpha component of the pixel to, say, the average
        // of the alpha values that you used during the premultiplication of the
        // RGB components, you can trick OVER compositing into doing a simplified
        // form of component alpha compositing. (You just need to make sure to
        // clamp the components of the result pixel to [0,255] afterwards.)
        mMayContainInvalidPremultipliedData = true;
      }
    }
  }

  CGContextSetBlendMode(mCg, ToBlendMode(aDrawOptions.mCompositionOp));
  UnboundnessFixer fixer;
  CGContextRef cg = fixer.Check(mCg, aDrawOptions.mCompositionOp);
  CGContextSetAlpha(cg, aDrawOptions.mAlpha);
  CGContextSetShouldAntialias(cg, aDrawOptions.mAntialiasMode != AntialiasMode::NONE);
  if (aDrawOptions.mAntialiasMode != AntialiasMode::DEFAULT) {
    CGContextSetShouldSmoothFonts(cg, aDrawOptions.mAntialiasMode == AntialiasMode::SUBPIXEL);
  }

  CGContextConcatCTM(cg, GfxMatrixToCGAffineTransform(mTransform));

  ScaledFontMac* macFont = static_cast<ScaledFontMac*>(aFont);

  //XXX: we should use a stack vector here when we have a class like that
  std::vector<CGGlyph> glyphs;
  std::vector<CGPoint> positions;
  glyphs.resize(aBuffer.mNumGlyphs);
  positions.resize(aBuffer.mNumGlyphs);

  // Handle the flip
  CGContextScaleCTM(cg, 1, -1);
  // CGContextSetTextMatrix works differently with kCGTextClip && kCGTextFill
  // It seems that it transforms the positions with TextFill and not with TextClip
  // Therefore we'll avoid it. See also:
  // http://cgit.freedesktop.org/cairo/commit/?id=9c0d761bfcdd28d52c83d74f46dd3c709ae0fa69

  for (unsigned int i = 0; i < aBuffer.mNumGlyphs; i++) {
    glyphs[i] = aBuffer.mGlyphs[i].mIndex;
    // XXX: CGPointMake might not be inlined
    positions[i] = CGPointMake(aBuffer.mGlyphs[i].mPosition.x,
                              -aBuffer.mGlyphs[i].mPosition.y);
  }

  //XXX: CGContextShowGlyphsAtPositions is 10.5+ for older versions use CGContextShowGlyphsWithAdvances
  if (isGradient(aPattern)) {
    CGContextSetTextDrawingMode(cg, kCGTextClip);
    CGRect extents;
    if (ScaledFontMac::CTFontDrawGlyphsPtr != nullptr) {
      CGRect *bboxes = new CGRect[aBuffer.mNumGlyphs];
      CTFontGetBoundingRectsForGlyphs(macFont->mCTFont, kCTFontDefaultOrientation,
                                      &glyphs.front(), bboxes, aBuffer.mNumGlyphs);
      extents = ComputeGlyphsExtents(bboxes, &positions.front(), aBuffer.mNumGlyphs, 1.0f);
      ScaledFontMac::CTFontDrawGlyphsPtr(macFont->mCTFont, &glyphs.front(),
                                         &positions.front(), aBuffer.mNumGlyphs, cg);
      delete[] bboxes;
    } else {
      CGRect *bboxes = new CGRect[aBuffer.mNumGlyphs];
      CGFontGetGlyphBBoxes(macFont->mFont, &glyphs.front(), aBuffer.mNumGlyphs, bboxes);
      extents = ComputeGlyphsExtents(bboxes, &positions.front(), aBuffer.mNumGlyphs, macFont->mSize);

      CGContextSetFont(cg, macFont->mFont);
      CGContextSetFontSize(cg, macFont->mSize);
      CGContextShowGlyphsAtPositions(cg, &glyphs.front(), &positions.front(),
                                     aBuffer.mNumGlyphs);
      delete[] bboxes;
    }
    CGContextScaleCTM(cg, 1, -1);
    DrawGradient(mColorSpace, cg, aPattern, extents);
  } else {
    //XXX: with CoreGraphics we can stroke text directly instead of going
    // through GetPath. It would be nice to add support for using that
    CGContextSetTextDrawingMode(cg, kCGTextFill);
    SetFillFromPattern(cg, mColorSpace, aPattern);
    if (ScaledFontMac::CTFontDrawGlyphsPtr != nullptr) {
      ScaledFontMac::CTFontDrawGlyphsPtr(macFont->mCTFont, &glyphs.front(),
                                         &positions.front(),
                                         aBuffer.mNumGlyphs, cg);
    } else {
      CGContextSetFont(cg, macFont->mFont);
      CGContextSetFontSize(cg, macFont->mSize);
      CGContextShowGlyphsAtPositions(cg, &glyphs.front(), &positions.front(),
                                     aBuffer.mNumGlyphs);
    }
  }

  fixer.Fix(mCg);
  CGContextRestoreGState(cg);
}

extern "C" {
void
CGContextResetClip(CGContextRef);
};

void
DrawTargetCG::CopySurface(SourceSurface *aSurface,
                          const IntRect& aSourceRect,
                          const IntPoint &aDestination)
{
  MarkChanged();

  if (aSurface->GetType() == SurfaceType::COREGRAPHICS_IMAGE ||
      aSurface->GetType() == SurfaceType::COREGRAPHICS_CGCONTEXT ||
      aSurface->GetType() == SurfaceType::DATA) {
    CGImageRef image = GetRetainedImageFromSourceSurface(aSurface);

    // XXX: it might be more efficient for us to do the copy directly if we have access to the bits

    CGContextSaveGState(mCg);

    // CopySurface ignores the clip, so we need to use private API to temporarily reset it
    CGContextResetClip(mCg);
    CGRect destRect = CGRectMake(aDestination.x, aDestination.y,
                                 aSourceRect.width, aSourceRect.height);
    CGContextClipToRect(mCg, destRect);

    CGContextSetBlendMode(mCg, kCGBlendModeCopy);

    CGContextScaleCTM(mCg, 1, -1);

    CGRect flippedRect = CGRectMake(aDestination.x - aSourceRect.x, -(aDestination.y - aSourceRect.y + double(CGImageGetHeight(image))),
                                    CGImageGetWidth(image), CGImageGetHeight(image));

    // Quartz seems to copy A8 surfaces incorrectly if we don't initialize them
    // to transparent first.
    if (mFormat == SurfaceFormat::A8) {
      CGContextClearRect(mCg, flippedRect);
    }
    CGContextDrawImage(mCg, flippedRect, image);

    CGContextRestoreGState(mCg);
    CGImageRelease(image);
  }
}

void
DrawTargetCG::DrawSurfaceWithShadow(SourceSurface *aSurface, const Point &aDest, const Color &aColor, const Point &aOffset, Float aSigma, CompositionOp aOperator)
{
  MarkChanged();

  CGImageRef image = GetRetainedImageFromSourceSurface(aSurface);

  IntSize size = aSurface->GetSize();
  CGContextSaveGState(mCg);
  //XXX do we need to do the fixup here?
  CGContextSetBlendMode(mCg, ToBlendMode(aOperator));

  CGContextScaleCTM(mCg, 1, -1);

  CGRect flippedRect = CGRectMake(aDest.x, -(aDest.y + size.height),
                                  size.width, size.height);

  CGColorRef color = ColorToCGColor(mColorSpace, aColor);
  CGSize offset = {aOffset.x, -aOffset.y};
  // CoreGraphics needs twice sigma as it's amount of blur
  CGContextSetShadowWithColor(mCg, offset, 2*aSigma, color);
  CGColorRelease(color);

  CGContextDrawImage(mCg, flippedRect, image);

  CGImageRelease(image);
  CGContextRestoreGState(mCg);

}

bool
DrawTargetCG::Init(BackendType aType,
                   unsigned char* aData,
                   const IntSize &aSize,
                   int32_t aStride,
                   SurfaceFormat aFormat)
{
  // XXX: we should come up with some consistent semantics for dealing
  // with zero area drawtargets
  if (aSize.width <= 0 || aSize.height <= 0 ||
      // 32767 is the maximum size supported by cairo
      // we clamp to that to make it easier to interoperate
      aSize.width > 32767 || aSize.height > 32767) {
    gfxWarning() << "Failed to Init() DrawTargetCG because of bad size.";
    mColorSpace = nullptr;
    mCg = nullptr;
    return false;
  }

  //XXX: handle SurfaceFormat

  //XXX: we'd be better off reusing the Colorspace across draw targets
  mColorSpace = CGColorSpaceCreateDeviceRGB();

  if (aData == nullptr && aType != BackendType::COREGRAPHICS_ACCELERATED) {
    // XXX: Currently, Init implicitly clears, that can often be a waste of time
    size_t bufLen = BufferSizeFromStrideAndHeight(aStride, aSize.height);
    if (bufLen == 0) {
      mColorSpace = nullptr;
      mCg = nullptr;
      return false;
    }
    static_assert(sizeof(decltype(mData[0])) == 1,
                  "mData.Realloc() takes an object count, so its objects must be 1-byte sized if we use bufLen");
    mData.Realloc(/* actually an object count */ bufLen, true);
    aData = static_cast<unsigned char*>(mData);
  }

  mSize = aSize;

  if (aType == BackendType::COREGRAPHICS_ACCELERATED) {
    RefPtr<MacIOSurface> ioSurface = MacIOSurface::CreateIOSurface(aSize.width, aSize.height);
    mCg = ioSurface->CreateIOSurfaceContext();
    // If we don't have the symbol for 'CreateIOSurfaceContext' mCg will be null
    // and we will fallback to software below
  }

  mFormat = SurfaceFormat::B8G8R8A8;

  if (!mCg || aType == BackendType::COREGRAPHICS) {
    int bitsPerComponent = 8;

    CGBitmapInfo bitinfo;
    if (aFormat == SurfaceFormat::A8) {
      if (mColorSpace)
        CGColorSpaceRelease(mColorSpace);
      mColorSpace = nullptr;
      bitinfo = kCGImageAlphaOnly;
      mFormat = SurfaceFormat::A8;
    } else {
      bitinfo = kCGBitmapByteOrder32Host;
      if (aFormat == SurfaceFormat::B8G8R8X8) {
        bitinfo |= kCGImageAlphaNoneSkipFirst;
        mFormat = aFormat;
      } else {
        bitinfo |= kCGImageAlphaPremultipliedFirst;
      }
    }
    // XXX: what should we do if this fails?
    mCg = CGBitmapContextCreate (aData,
                                 mSize.width,
                                 mSize.height,
                                 bitsPerComponent,
                                 aStride,
                                 mColorSpace,
                                 bitinfo);
  }

  assert(mCg);
  // CGContext's default to have the origin at the bottom left
  // so flip it to the top left
  CGContextTranslateCTM(mCg, 0, mSize.height);
  CGContextScaleCTM(mCg, 1, -1);
  // See Bug 722164 for performance details
  // Medium or higher quality lead to expensive interpolation
  // for canvas we want to use low quality interpolation
  // to have competitive performance with other canvas
  // implementation.
  // XXX: Create input parameter to control interpolation and
  //      use the default for content.
  CGContextSetInterpolationQuality(mCg, kCGInterpolationLow);


  if (aType == BackendType::COREGRAPHICS_ACCELERATED) {
    // The bitmap backend uses callac to clear, we can't do that without
    // reading back the surface. This should trigger something equivilent
    // to glClear.
    ClearRect(Rect(0, 0, mSize.width, mSize.height));
  }

  return true;
}

static void
EnsureValidPremultipliedData(CGContextRef aContext)
{
  if (CGBitmapContextGetBitsPerPixel(aContext) != 32 ||
      CGBitmapContextGetAlphaInfo(aContext) != kCGImageAlphaPremultipliedFirst) {
    return;
  }

  uint8_t* bitmapData = (uint8_t*)CGBitmapContextGetData(aContext);
  int w = CGBitmapContextGetWidth(aContext);
  int h = CGBitmapContextGetHeight(aContext);
  int stride = CGBitmapContextGetBytesPerRow(aContext);
  for (int y = 0; y < h; y++) {
    for (int x = 0; x < w; x++) {
      int i = y * stride + x * 4;
      uint8_t a = bitmapData[i + 3];

      // Clamp rgb components to the alpha component.
      if (bitmapData[i + 0] > a) {
        bitmapData[i + 0] = a;
      }
      if (bitmapData[i + 1] > a) {
        bitmapData[i + 1] = a;
      }
      if (bitmapData[i + 2] > a) {
        bitmapData[i + 2] = a;
      }
    }
  }
}

void
DrawTargetCG::Flush()
{
  if (GetContextType(mCg) == CG_CONTEXT_TYPE_IOSURFACE) {
    CGContextFlush(mCg);
  } else if (GetContextType(mCg) == CG_CONTEXT_TYPE_BITMAP &&
             mMayContainInvalidPremultipliedData) {
    // We can't guarantee that all our users can handle pixel data where an RGB
    // component value exceeds the pixel's alpha value. In particular, the
    // color conversion that CG does when we draw a CGImage snapshot of this
    // context into a context that has a different color space throws up on
    // invalid premultiplied data and creates completely wrong colors.
    // Sanitizing the data means that we lose some of the fake component alpha
    // behavior that font rendering tries to give us, but the result still
    // looks good enough to prefer it over grayscale font anti-aliasing.
    EnsureValidPremultipliedData(mCg);
    mMayContainInvalidPremultipliedData = false;
  }
}

bool
DrawTargetCG::Init(CGContextRef cgContext, const IntSize &aSize)
{
  // XXX: we should come up with some consistent semantics for dealing
  // with zero area drawtargets
  if (aSize.width == 0 || aSize.height == 0) {
    mColorSpace = nullptr;
    mCg = nullptr;
    return false;
  }

  //XXX: handle SurfaceFormat

  //XXX: we'd be better off reusing the Colorspace across draw targets
  mColorSpace = CGColorSpaceCreateDeviceRGB();

  mSize = aSize;

  mCg = cgContext;
  CGContextRetain(mCg);

  assert(mCg);

  // CGContext's default to have the origin at the bottom left.
  // However, currently the only use of this function is to construct a
  // DrawTargetCG around a CGContextRef from a cairo quartz surface which
  // already has it's origin adjusted.
  //
  // CGContextTranslateCTM(mCg, 0, mSize.height);
  // CGContextScaleCTM(mCg, 1, -1);

  mFormat = SurfaceFormat::B8G8R8A8;
  if (GetContextType(mCg) == CG_CONTEXT_TYPE_BITMAP) {
    CGColorSpaceRef colorspace;
    CGBitmapInfo bitinfo = CGBitmapContextGetBitmapInfo(mCg);
    colorspace = CGBitmapContextGetColorSpace (mCg);
    if (CGColorSpaceGetNumberOfComponents(colorspace) == 1) {
      mFormat = SurfaceFormat::A8;
    } else if ((bitinfo & kCGBitmapAlphaInfoMask) == kCGImageAlphaNoneSkipFirst) {
      mFormat = SurfaceFormat::B8G8R8X8;
    }
  }

  return true;
}

bool
DrawTargetCG::Init(BackendType aType, const IntSize &aSize, SurfaceFormat &aFormat)
{
  int32_t stride = GetAlignedStride<16>(aSize.width * BytesPerPixel(aFormat));
  
  // Calling Init with aData == nullptr will allocate.
  return Init(aType, nullptr, aSize, stride, aFormat);
}

TemporaryRef<PathBuilder>
DrawTargetCG::CreatePathBuilder(FillRule aFillRule) const
{
  return new PathBuilderCG(aFillRule);
}

void*
DrawTargetCG::GetNativeSurface(NativeSurfaceType aType)
{
  if ((aType == NativeSurfaceType::CGCONTEXT && GetContextType(mCg) == CG_CONTEXT_TYPE_BITMAP) ||
      (aType == NativeSurfaceType::CGCONTEXT_ACCELERATED && GetContextType(mCg) == CG_CONTEXT_TYPE_IOSURFACE)) {
    return mCg;
  } else {
    return nullptr;
  }
}

void
DrawTargetCG::Mask(const Pattern &aSource,
                   const Pattern &aMask,
                   const DrawOptions &aDrawOptions)
{
  MarkChanged();

  CGContextSaveGState(mCg);

  if (isGradient(aMask)) {
    assert(0);
  } else {
    if (aMask.GetType() == PatternType::COLOR) {
      DrawOptions drawOptions(aDrawOptions);
      const Color& color = static_cast<const ColorPattern&>(aMask).mColor;
      drawOptions.mAlpha *= color.a;
      assert(0);
      // XXX: we need to get a rect that when transformed covers the entire surface
      //Rect
      //FillRect(rect, aSource, drawOptions);
    } else if (aMask.GetType() == PatternType::SURFACE) {
      const SurfacePattern& pat = static_cast<const SurfacePattern&>(aMask);
      CGImageRef mask = GetRetainedImageFromSourceSurface(pat.mSurface.get());
      MOZ_ASSERT(pat.mSamplingRect.IsEmpty(), "Sampling rect not supported with masks!");
      Rect rect(0,0, CGImageGetWidth(mask), CGImageGetHeight(mask));
      // XXX: probably we need to do some flipping of the image or something
      CGContextClipToMask(mCg, RectToCGRect(rect), mask);
      FillRect(rect, aSource, aDrawOptions);
      CGImageRelease(mask);
    }
  }

  CGContextRestoreGState(mCg);
}

void
DrawTargetCG::PushClipRect(const Rect &aRect)
{
  CGContextSaveGState(mCg);

  /* We go through a bit of trouble to temporarilly set the transform
   * while we add the path */
  CGAffineTransform previousTransform = CGContextGetCTM(mCg);
  CGContextConcatCTM(mCg, GfxMatrixToCGAffineTransform(mTransform));
  CGContextClipToRect(mCg, RectToCGRect(aRect));
  CGContextSetCTM(mCg, previousTransform);
}


void
DrawTargetCG::PushClip(const Path *aPath)
{
  CGContextSaveGState(mCg);

  CGContextBeginPath(mCg);
  assert(aPath->GetBackendType() == BackendType::COREGRAPHICS);

  const PathCG *cgPath = static_cast<const PathCG*>(aPath);

  // Weirdly, CoreGraphics clips empty paths as all shown
  // but emtpy rects as all clipped.  We detect this situation and
  // workaround it appropriately
  if (CGPathIsEmpty(cgPath->GetPath())) {
    // XXX: should we return here?
    CGContextClipToRect(mCg, CGRectZero);
  }


  /* We go through a bit of trouble to temporarilly set the transform
   * while we add the path. XXX: this could be improved if we keep
   * the CTM as resident state on the DrawTarget. */
  CGContextSaveGState(mCg);
  CGContextConcatCTM(mCg, GfxMatrixToCGAffineTransform(mTransform));
  CGContextAddPath(mCg, cgPath->GetPath());
  CGContextRestoreGState(mCg);

  if (cgPath->GetFillRule() == FillRule::FILL_EVEN_ODD)
    CGContextEOClip(mCg);
  else
    CGContextClip(mCg);
}

void
DrawTargetCG::PopClip()
{
  CGContextRestoreGState(mCg);
}

void
DrawTargetCG::MarkChanged()
{
  if (mSnapshot) {
    if (mSnapshot->refCount() > 1) {
      // We only need to worry about snapshots that someone else knows about
      mSnapshot->DrawTargetWillChange();
    }
    mSnapshot = nullptr;
  }
}

CGContextRef
BorrowedCGContext::BorrowCGContextFromDrawTarget(DrawTarget *aDT)
{
  if ((aDT->GetBackendType() == BackendType::COREGRAPHICS ||
       aDT->GetBackendType() == BackendType::COREGRAPHICS_ACCELERATED) &&
      !aDT->IsTiledDrawTarget() && !aDT->IsDualDrawTarget()) {
    DrawTargetCG* cgDT = static_cast<DrawTargetCG*>(aDT);
    cgDT->Flush();
    cgDT->MarkChanged();

    // swap out the context
    CGContextRef cg = cgDT->mCg;
    cgDT->mCg = nullptr;

    // save the state to make it easier for callers to avoid mucking with things
    CGContextSaveGState(cg);

    CGContextConcatCTM(cg, GfxMatrixToCGAffineTransform(cgDT->mTransform));

    return cg;
  }
  return nullptr;
}

void
BorrowedCGContext::ReturnCGContextToDrawTarget(DrawTarget *aDT, CGContextRef cg)
{
  DrawTargetCG* cgDT = static_cast<DrawTargetCG*>(aDT);

  CGContextRestoreGState(cg);
  cgDT->mCg = cg;
}


}
}
