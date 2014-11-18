const {Cc, Ci, Cu} = require("chrome");
const URI = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
const VariablesView = require("resource:///modules/devtools/VariablesView.jsm").VariablesView;
const WebConsoleUtils = require("devtools/toolkit/webconsole/utils").Utils;

const CONSOLE_API_LEVELS_TO_SEVERITIES = {
  error: "error",
  exception: "error",
  assert: "error",
  warn: "warn",
  info: "info",
  log: "log",
  trace: "log",
  table: "log",
  debug: "log",
  dir: "log",
  group: "log",
  groupCollapsed: "log",
  groupEnd: "log",
  time: "log",
  timeEnd: "log",
  count: "log"
};

const CATEGORY_CLASS_FRAGMENTS = [
  "network", "cssparser", "exception", "console",
  "input", "output", "security"
];

function parseMessage(msg) {
  if(msg.arguments) {
    let args = msg.arguments;
    return {
      pieces: args.map(parseGrip),
      severity: CONSOLE_API_LEVELS_TO_SEVERITIES[msg.level],
      category: CATEGORY_CLASS_FRAGMENTS[msg.category]
    };
  }
  else {
    return {
      pieces: [parseGrip(msg.error ? msg.error : msg.response.result)],
      severity: msg.error ? 'error' : 'info',
      category: 'output'
    }
  }
}

function parseGrip(grip) {
  let isPrimitive = VariablesView.isPrimitive({ value: grip });
  let isActorGrip = WebConsoleUtils.isActorGrip(grip);

  if(isActorGrip) {
    return { type: 'string', value: 'notimplemented' };
  }

  if(isPrimitive) {
    if(typeof grip === 'string' && containsURL(grip)) {
      return parseURLs(grip);
    }

    return {
      type: typeof grip,
      value: grip
    }
  }
}

function parseURLs(str) {
  let tokens = str.split(/\s+/);
  let textStart = 0;
  let tokenStart;
  let acc = ['"'];

  for(let token of tokens) {
    tokenStart = str.indexOf(token, textStart);
    if(isURL(token)) {
      acc.push(str.slice(textStart, tokenStart));
      acc.push({ url: token });
      textStart = tokenStart + token.length;
    }
  }

  acc.push(str.slice(textStart) + '"');
  return { multipart: true, values: acc };
}

function containsURL(str) {
  return str.split(/\s+/).some(isURL);
}

function isURL(str) {
  try {
    let url = URI.newURI(str, null, null).QueryInterface(Ci.nsIURL);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = parseMessage;
