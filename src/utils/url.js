"use strict";

const URL = require("url");

function normalizeUrl(url) {
  const parsedUrl = URL.parse(url);

  const { pathname: oldPathname } = parsedUrl;
  if (oldPathname.endsWith("/")) {
    // strip ending
    const pathname = oldPathname.slice(0, oldPathname.length - 1);

    updatePathname(parsedUrl, pathname);
  }

  return parsedUrl;
}

function updatePathname(url, newPathname) {
  const { pathname } = url;

  url.pathname = newPathname;
  url.path = url.path.replace(pathname, newPathname);
  url.href = url.href.replace(pathname, newPathname);

  return url;
}

module.exports = { normalizeUrl };
