"use strict";

const { assert } = require("chai");

describe("utils/url", function() {
  const { normalizeUrl } = require("../../src/utils/url");

  function assertNormalizedUrl(url, expected) {
    const { href: normalized } = normalizeUrl(url);
    assert(normalized === expected);
  }

  it("should work", function() {
    assertNormalizedUrl(
      "http://example.com/hello/title/?hello=world#hello",
      "http://example.com/hello/title?hello=world#hello"
    );

    assertNormalizedUrl("/title/", "/title");
    assertNormalizedUrl("/title", "/title");
  });
});
