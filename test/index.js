"use strict";

const { Nav } = require("../src");
const NavExpress = require("../src/express");
const { assert } = require("chai");

describe("Nav", function() {
  describe("should work with one link", function() {
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

    it("indepentently", function() {
      const nav = new Nav({ props: { title: "App Title" } }, initNav);

      testNav(nav);
    });

    it("with middleware", function() {
      const middleware = NavExpress.init({}, initNav);

      const req = {};
      const res = {};
      middleware(req, res, e => {
        const { nav } = res;

        testNav(nav);
      });
    });
  });

  describe("should work with children", function() {
    /**
     *
     * @param {Nav} nav
     */
    function initNav(nav) {
      nav.appendCategory({ title: "Category 1" }, nav => {
        nav.appendLink({ title: "Link 1" });
      });
    }

    it("indepentently", function() {
      const nav = new Nav({ props: { title: "App Title" } }, initNav);

      const t = nav.traverse((item, index, traverseChildren) => {
        if (item.type === "link") {
          return "link";
        }

        return traverseChildren();
      });

      console.log(t);
    });
  });
});
