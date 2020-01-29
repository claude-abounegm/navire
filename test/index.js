"use strict";

const { Nav } = require("../src");
const NavExpress = require("../src/express");
const { assert } = require("chai");

describe("Nav", function() {
  function initNav(nav) {
    nav.appendLink({ title: "First link" });
  }

  function testNav(nav) {
    const items = [];
    nav.traverse(function(item, index, traverseChildren) {
      assert(this === nav);

      items.push(item);

      traverseChildren();
    });

    assert(items.length === 1);
  }

  it("works with one link", function() {
    const nav = new Nav({ props: { title: "App Title" } }, initNav);

    testNav(nav);
  });

  it("middleware", function() {
    const middleware = NavExpress.init({}, initNav);

    const req = {};
    const res = {};
    middleware(req, res, e => {
      const { nav } = res;

      testNav(nav);
    });
  });
});
