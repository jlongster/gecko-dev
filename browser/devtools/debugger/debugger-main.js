const { classes: Cc, interfaces: Ci, utils: Cu } = Components;

const loader = Cu.import("resource://gre/modules/commonjs/toolkit/loader.js", {}).Loader;
const devtoolsRequire = Cu.import("resource://gre/modules/devtools/Loader.jsm", {}).devtools.require;
const loaderOptions = devtoolsRequire('@loader/options');

function makeRequire(window) {
  loaderOptions.id = "jsdebugger";
  loaderOptions.sharedGlobal = true;
  loaderOptions.sandboxPrototype = window;

  let mainLoader = loader.Loader(loaderOptions);
  let mainModule = loader.Module(
    "resource://gre/browser/modules/devtools/debugger/",
    "resource://gre/browser/modules/devtools/debugger/main.js"
  );
  return loader.Require(mainLoader, mainModule);
}

EXPORTED_SYMBOLS = ["makeRequire"];
