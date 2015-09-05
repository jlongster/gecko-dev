
function getSource(state, actor) {
  return state.sources.sources.get(actor);
}

function getSources(state) {
  return state.sources.sources;
}

function getSourceByURL(state, url) {
  for(let [actor, source] of state.sources.sources) {
    if(source.url === url) {
      return source;
    }
  }
}

function getSelectedSource(state) {
  return state.sources.selectedSource;
}

function getSourceText(state, actor) {
  return state.sources.sourcesText.get(actor);
}

function getBreakpoints(state) {
  return [...state.breakpoints.breakpoints.values()];
}

function getBreakpoint(state, location) {
  return state.breakpoints.breakpoints.get(makeLocationId(location));
}

function makeLocationId(location) {
  return location.actor + ':' + location.line.toString();
}

module.exports = {
  getSource,
  getSources,
  getSourceByURL,
  getSelectedSource,
  getSourceText,
  getBreakpoint,
  getBreakpoints,
  makeLocationId
};
