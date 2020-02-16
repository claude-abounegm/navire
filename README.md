# navire

Simple, elegant navigation

Navire ships with typings out of the box and can be used both server and client-side.

## Usage

### npm

```bash
npm i navire
```

and then you can require it:

```javascript
const Navire = require("navire");
```

### Browser

Download `/browser/dist/navire-browser.js` and import in the browser like:

```html
<script src="navire-browser.js"></script>
<!-- `Navire` is now a global variable. -->
```

### Instructions

`navire` uses a two-step approach to build navigation.

1. Build the full navigation tree.
2. Traverse the tree and build the front-end.

Let's take a look at **Step 1**:

```javascript
// switch whether to display the category nav item
const shouldShowCategory = false;

// Initialize navire
const navire = new Navire(
  // the first parameter initializes navire (the navigation tree):
  // - you can pass a function, which gives you
  //     the Navire instance as its first parameter
  // - you can also pass the array directly
  navire => [
    // this is the first link in the navigation,
    // you need to define a type.
    // The types currently supported are:
    //   ["category", "link", "divider"]
    //
    //  More details on each type and how they can be used
    //  can be found later in the documentation.
    //
    // (index 0, level 0)
    {
      type: "link",
      title: "Title",
      // Since the href of this nav is /title?search=45.
      // This item can only be found by: navire.findByHref('/title?search=45')
      href: "/title?search=45",
      // The `match` field helps navire identify this nav
      // item by href, so navire.findByHref('/title') now matches this element
      // navire.findByHref('/title?foo=world'), also works, etc...
      match: /\/title/
    },
    {
      // type "category" is a container for other nav elements, it can have
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
      // nav item. In this case, it's "Category 1".
      // You can also pass an array here, or pass a function that returns an array.
      // You choose what style you like best, and what best fits your needs.
      children: nav => {
        // anything appended here will be appended to "Category 1" as a child.
        // if the `show` field above evaluates to false, none of these items
        // would be displayed.

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

Now that we initialized navire, we can proceed to **Step 2**, where we traverse the navigation tree and generate the front-end:

```javascript
navire.traverse((item, traverseChildren) => {
  // traverse
});
```

## Usage with React.js

An example on using this project with React.js can be found at: [navire-react-demo](https://github.com/claude-abounegm/navire-react-demo).

## Usage with jQuery

An example on using this project with jQuery and Bootstrap can be found at `/browser/example/nav.js`.

You can start the dev server to see the example by running:

```bash
npm run browser:dev
```

## Plugins

- [navire-express](https://github.com/claude-abounegm/navire-express)
