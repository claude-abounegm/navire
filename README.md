# navire

Simple, elegant navigation

Navire ships with typings out of the box and can be used both server and client-side.

---

## Usage

### npm

```bash
npm i navire
```

and then you can require it:

```javascript
const Navire = require("navire");
```

---

### Browser

Download `/browser/dist/navire-browser.js` and import in the browser like:

```html
<script src="navire-browser.js"></script>
<!-- `Navire` is now a global variable. -->
```

### Instructions

---

`Navire` is the main class that is used for managing the full navigation tree. When initialized, we use `navire` to represent it. It contains methods such as `findByHref()`, `findByTitle()`, `get()`, and `traverse()`. These are essential to using navire effectively. `Navire` inherits from `NavItem`, so you also have access to the methods below.

`NavItem` is the class that is used for navigation items such as links, categories and dividers. When initialized, we use `nav` to represent it. It contains methods such as `appendCategory()`, `appendDivider()`, `appendLink()`, and more.

---

`navire` uses a simple two-step approach to build navigation:

1. Build the full navigation tree.
2. Traverse the tree and build the front-end.

Let's take a look at **Step 1**:

```javascript
// whether to display the category nav item
const shouldShowCategory = false;

// Initialize navire
const navire = new Navire(
  // The first parameter initializes navire, you can pass:
  //  - A function, which gives you the Navire instance as its first parameter
  //  - An array directly
  navire => [
    // Every nav item needs to have a type.
    // The types navire currently support are:
    //   ["category", "link", "divider"]
    //   - "category" is used as a container for other nav items.
    //   - "link" is used to represent a navigation link.
    //   - "divider" is used to represent a divider. It can also have a title.
    //  More details on each type can be found later in the documentation.
    //
    // This is the first item in the navigation menu (index 0, level 0)
    {
      type: "link",
      title: "Title",
      // Since the href of this nav is /title?search=45, currently, this
      // item can only be found by: navire.findByHref("/title?search=45").
      href: "/title?search=45",
      // The `match` field helps navire identify this nav item by href,
      // so navire.findByHref("/title") now matches this element.
      // navire.findByHref("/title?foo=world"), also works, etc...
      match: /\/title/
    },
    {
      // Type "category" is a container for other nav elements, it can have
      // a title and children. (index 1, level 0)
      type: "category",
      title: "Category 1",
      // `show` is a field that can accept a function or boolean.
      // It can be used on any nav item just like you specify `type` and `title`.
      // If the field evaluates to true, the nav item is displayed,
      // otherwise, it is not shown and neither are its children.
      show: shouldShowCategory, // can also be () => shouldShowCategory
      // just like we passed a function to init navire, we can pass a function
      // here and append children in a functional manner. `navire` passes a
      // NavItem instance as it's first parameter, which points to the current
      // nav item. In this case, it's the "Category 1" nav item.
      // You can also pass an array here, or pass a function that returns an array.
      // You choose what style you like best, and what best fits your needs.
      children: nav => {
        // Anything appended here will be appended to "Category 1" as a child.
        // If the `show` field above evaluates to false, none of these items
        // would be displayed.

        // Note how in the next statement we do not pass { "type": "$value" },
        // since we are explicitly specifying the types by calling the methods.

        // /link1 is the first child (index 0, level 1)
        nav.appendLink({ title: "Link 1", href: "/link1" });

        // this is a "divider" with a title (index 1, level 1)
        nav.appendDivider({ title: navire.props.title });

        // /link2 (index 2, level 1)
        nav.appendLink({ title: "Link 2", href: "/link2" });
      }
    }
  ],
  // These are props that might be needed while rendering the navigation
  // For example, a web app usually has a title and is placed in the
  // navigation bar. If you are rendering the navigation bar and would like
  // to keep all data related to navbar in one place, you can pass these
  // attributes here. They can then be accessed later as `navire.props.field`.
  // Look at the divider above, the title of the divider will be "Foo".
  { props: { title: "Foo" } }
);
```

Now that we initialized navire, we can do all sorts of things, ex:

```javascript
// this will find and return "Link 1" nav item
const navLink1 = navire.findByHref("/link1");

// This will set "Link 1" as the active nav item. Since "Link 1"
// is a child of "Category 1", "Category 1" will also be active.
navLink1.activate();

navLink1.active; // true
navire.findByTitle("Category 1").active; // true
```

We can proceed to **Step 2**, where we traverse the navigation tree and generate the front-end:

```javascript
navire.traverse((item, traverseChildren) => {
  // traverse
});
```

---

## Usage with React.js

An example on using this project with React.js can be found at: [navire-react-demo](https://github.com/claude-abounegm/navire-react-demo).

---

## Usage with jQuery

An example on using this project with jQuery and Bootstrap can be found at `/browser/example/nav.js`.

You can start the dev server to see the example by running:

```bash
npm run browser:dev
```

---

## Plugins

- [navire-express](https://github.com/claude-abounegm/navire-express)
