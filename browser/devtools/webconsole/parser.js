const {Cc, Ci, Cu} = require("chrome");
const URI = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
const VariablesView = require("resource:///modules/devtools/VariablesView.jsm").VariablesView;
const WebConsoleUtils = require("devtools/toolkit/webconsole/utils").Utils;

function parseMessage(msg) {
  let args = msg.arguments;
  return args.map(grip => {
    let isPrimitive = VariablesView.isPrimitive({ value: grip });
    let isActorGrip = WebConsoleUtils.isActorGrip(grip);

    if(isActorGrip) {
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
  });
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
