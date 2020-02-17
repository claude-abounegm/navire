const Navire = require("../src");
const { expect } = require("chai");

describe("Nav", function() {
  describe("should work with one link", function() {
    /**
     *
     * @param {Navire} navire
     */
    function initNav(navire) {
      navire.appendLink({ title: "Link1", href: "/link1" });
    }

    /**
     *
     * @param {Navire} navire
     */
    function testNav(navire) {
      const items = [];
      navire.traverse(function(item, traverseChildren) {
        expect(navire.get(this.path)).to.be.equal(this);

        items.push(item);

        traverseChildren();
      });

      expect(items.length).to.be.equal(1);
    }

    it("using ctor", function() {
      const nav = new Navire(initNav);

      testNav(nav);
    });
  });

  describe("should work with children", function() {
    /**
     *
     * @param {Navire} nav
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
          expect(nav.appendDivider("Divider2").level).to.be.equal(1);
          nav.appendLink({ title: "Link 2", href: "/link2" });
        });
      });
    }

    it("using ctor", function() {
      const navire = new Navire(initNav, { props: { title: "App Title" } });

      const t = navire.traverse((item, traverseChildren) => {
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

      expect(navire.findByHref("/")).to.be.false;

      const titleNav = navire.findByHref("/title?x=5");
      expect(titleNav).to.not.be.false;

      expect(titleNav.level).to.be.equal(0);

      // divider-title test
      const link2Nav = navire.findByHref("/link2");
      expect(link2Nav.level).to.be.equal(1);
    });
  });
});

describe("Nav", function() {
  it("ctor with array", function() {
    const navire = new Navire(
      navire => [
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
            { type: "divider", title: navire.props.title },
            { type: "link", title: "Link 2", href: "/link2" }
          ]
        }
      ],
      { props: { title: "Foo" } }
    );

    const serialized = navire.serialize();
    const deserialized = Navire.deserialize(serialized);

    expect(navire.build()).to.deep.equal(deserialized.build());

    expect(navire.findByTitle("Category 1").length).to.equal(3);
    expect(navire.findByTitle("Link 3")).to.be.false;
    expect(navire.findByTitle("Link 2")).to.not.be.false;
    expect(navire.findByTitle(/Link/, true).length).to.equal(2);

    expect(navire.findByHref("/link1")).to.not.be.false;

    expect(navire.get("Category 1.Foo")).to.not.be.false;
  });
});
