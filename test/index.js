"use strict";

const { Nav } = require("../src");
const NavExpress = require("../src/express");
const { assert } = require("chai");

describe("Nav", function() {
  it("works with one link", function() {
    const nav = new Nav({}, nav => {
      nav.appendLink({ title: "First link" });
    });

    const items = [];
    nav.traverse((item, index, traverseChildren) => {
      items.push(item);

      traverseChildren();
    });

    assert(items.length === 1);
  });

  it("middleware", function() {
    const middleware = NavExpress.init({}, nav => {
      nav.appendLink({ title: "First link" });
    });

    const req = {};
    const res = {};
    middleware(req, res, e => {
      const { nav } = res;

      const items = [];
      nav.traverse((item, index, traverseChildren) => {
        items.push(item);

        traverseChildren();
      });

      assert(items.length === 1);
    });
  });
});
