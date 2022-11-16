import url from 'url';

function createSocketURL(parsedURL) {
  var hostname = parsedURL.hostname,
    port = parsedURL.port,
    pathname = parsedURL.pathname;
  return url.format({
    protocol: 'ws:',
    hostname: hostname || 'localhost',
    port: port || 38988,
    pathname: pathname || '/ws',
    slashes: true,
  });
}

export default createSocketURL;
