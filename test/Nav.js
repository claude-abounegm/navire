const Nav = require("../src");
const NavExpress = require("../src/express");
const { expect } = require("chai");

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
        expect(nav).to.be.equal(this);

        items.push(item);

        traverseChildren();
      });

      expect(items.length).to.be.equal(1);
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

      nav.appendDivider("Divider1", nav => {
        nav.appendCategory({ title: "Category 1" }, nav => {
          nav.appendLink({ title: "Link 1", href: "/link1" });
          nav.appendDivider("Divider2");
          nav.appendLink({ title: "Link 2", href: "/link2" });
        });
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

        if (type === "divider-title") {
          const ret = traverseChildren();
          if (ret.length === 0) {
            // nav.traverse() discards null values
            return null;
          }

          return ret;
        }

        if (type === "category") {
          return ["before", ...traverseChildren(), "after"];
        }

        return null;
      });

      expect(t).deep.equal([
        "/title?search=45",
        [["before", "/link1", "after"]]
      ]);

      expect(nav.find("/")).to.be.false;

      const titleNav = nav.find("/title?x=5");
      expect(titleNav).to.not.be.false;

      expect(titleNav.level).to.be.equal(0);

      // divider-title test
      const link2Nav = nav.find("/link2");
      expect(link2Nav.level).to.be.equal(2);
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

    expect(nav.get("Category 1.Foo.2")).to.not.be.false;
    expect(nav.find("/link1")).to.not.be.false;
  });
});
