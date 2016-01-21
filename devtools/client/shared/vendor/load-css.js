module.exports = function loadCSS(fullUrl) {
  fullUrl = fullUrl.replace(/\.js$/, '');
  const links = [...document.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'link')];
  let parentNode = (
    document.body ? document.body :
    document.getElementsByTagName('window')[0]
  );

  const found = links.find(link => {
    // Live reloading needs this
    return link.href.startsWith(fullUrl);
  });

  if(!found) {
    const newLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'link');
    newLink.rel = 'stylesheet';
    newLink.type = 'text/css';
    newLink.href = fullUrl;
    parentNode.appendChild(newLink);
  }
}
