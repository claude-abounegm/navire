const Nav = require("../src");
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
      nav.appendLink({
        title: "Title",
        href: "/title?search=45",
        match: /\/title/
      });

      nav.appendCategory({ title: "Category 1" }, nav => {
        nav.appendLink({ title: "Link 1", href: "/link1" });
        nav.appendDivider("Divider");
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

        if (type === "category") {
          return ["before", ...traverseChildren(), "after"];
        }

        return null;
      });

      assert.deepEqual(t, ["/title?search=45", ["before", "/link1", "after"]]);

      assert(nav.find("/") === false);

      const titleNav = nav.find("/title?x=5");
      assert(titleNav !== false);

      assert(titleNav.level === 0);
    });
  });
});

describe("Nav", function() {
  it("ctor with array", function() {
    const nav = new Nav({ props: { title: "Foo" } }, nav => [
      {
        type: "link",
        title: "Title",
        href: "/title?search=45",
        match: /\/title/
      },
      {
        type: "category",
        title: "Category 1",
        children: () => [
          { type: "link", title: "Link 1", href: "/link1" },
          { type: "divider", title: nav.props.title },
          { type: "link", title: "Link 2", href: "/link2" }
        ]
      }
    ]);

    assert(nav.get("Category 1.Foo.2") !== false);
    assert(nav.find("/link1") !== false);
  });
});
