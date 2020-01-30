"use strict";

const URL = require("url");

function normalizeUrl(url) {
  const parsedUrl = URL.parse(url);

  let { pathname: oldPathname } = parsedUrl;
  if (oldPathname.endsWith("/")) {
    // strip ending
    const pathname = oldPathname.slice(0, oldPathname.length - 1);

    parsedUrl.pathname = pathname;
    parsedUrl.path = parsedUrl.path.replace(oldPathname, pathname);
    parsedUrl.href = parsedUrl.href.replace(oldPathname, pathname);
  }

  return parsedUrl;
}

module.exports = { normalizeUrl };
