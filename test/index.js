"use strict";

const { Nav } = require("../src");
const NavExpress = require("../src/express");
const { assert } = require("chai");

describe("Nav", function() {
  describe("should work with one link", function() {
    const props = { title: "App Title" };

    /**
     *
     * @param {Nav} nav
     */
    function initNav(nav) {
      nav.appendLink({ title: "Link1", href: "/link1" });
    }

    /**
     *
     * @param {Nav} nav
     */
    function testNav(nav) {
      const items = [];
      nav.traverse(function(item, traverseChildren) {
        assert(this === nav);

        items.push(item);

        traverseChildren();
      });

      assert(items.length === 1);
    }

    it("using ctor", function() {
      const nav = new Nav({ props }, initNav);

      testNav(nav);
    });

    it("using middleware", function() {
      const middleware = NavExpress.init({ props }, initNav);

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
        nav.appendLink({ title: "Link 1", href: "/link1" });
        nav.appendLink({ title: "Link 2", href: "/link2" });
      });
    }

    it("using ctor", function() {
      const nav = new Nav({ props: { title: "App Title" } }, initNav);

      const t = nav.traverse((item, traverseChildren) => {
        const { type, href, index } = item;

        if (type === "link") {
          if (index === 0) {
            return href;
          }

          return null;
        }

        return ["before", ...traverseChildren(), "after"];
      });

      assert.deepEqual(t, [["before", "/link1", "after"]]);

      // nav.getByHref("/link2").activate();
      // console.log(nav.activeNavPath);
    });
  });
});
