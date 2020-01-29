"use strict";

const { Nav } = require("../src");
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
});
