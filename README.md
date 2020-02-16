# navire

Simple, elegant navigation

Navire ships with typings out of the box and can be used both server and client-side.

## Usage

### npm

```bash
npm i navire
```

```javascript
const Nav = require("navire");
```

### Browser

Download `/browser/dist/navire-browser.js` and import in the browser like:

```html
<script src="navire-browser.js"></script>
<!-- `Nav` is now a global variable. -->
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
const navire = new Nav(
  // the first parameter initializes the navigation tree:
  // - you can pass a function, which gives you
  //     a Nav instance as its first parameter
  // - you can also pass the array directly
  navire => [
    // this is the first link in the navigation,
    // you need to define a type.
    // The types currently supported are:
    //   ["category", "link", "divider"]
    //
    //  More details on each type and how they can be used
    //  can be found later in the documentation.
    {
      type: "link",
      title: "Title",
      // Since the href of this nav is /title?search=45.
      // This item can only be found by: nav.findByHref('/title?search=45')
      href: "/title?search=45",
      // the `match` field helps navire identify this nav
      // item by href, so nav.findByHref('/title') now matches this element
      // nav.findByHref('/title?foo=world'), also works, etc...
      match: /\/title/
    },
    {
      // type "category" is a container for other nav elements, it can have
      // a title and children.
      type: "category",
      title: "Category 1",
      // show is a special field that can accept a function or boolean.
      // if the field evaluates to true, the nav item is displayed,
      // otherwise, it is not shown and neither are its children.
      show: shouldShowCategory, // can also be () => shouldShowCategory
      // just like we passed a function to init navire, we can pass a function
      // here and append children in a functional manner. `navire` passes a
      // NavItem instance as it's first parameter, which points to the current
      // nav item. in this case, it's "Category 1".
      // You can also pass an array here, or pass a function that returns an array
      // You choose what style you like best, and what best fits your needs.
      children: nav => {
        // anything appended here will be appended to "Category 1" as a child.

        // /link1 is the first child
        nav.appendLink({ title: "Link 1", href: "/link1" });
        // this is a "divider" with a title
        nav.appendDivider({ title: navire.props.title }, nav => {
          // now appending children to the divider

          // /link2 has index 2
          nav.appendLink({ title: "Link 2", href: "/link2" });
        });
      }
    }
  ],
  // these are props that might be needed while rendering the navigation
  // for example, the web app usually has a title and is placed in the
  // navigation bar. Pass the attributes here, they can then be accessed
  // as `nav.props.field`. Look at the divider above, the title of the
  // divider will be "Foo"
  { props: { title: "Foo" } }
);
```

## Usage with React.js

An example on using this project with React.js can be found at: [navire-react-demo](https://github.com/claude-abounegm/navire-react-demo).

## Usage with jQuery

An example on using this project with jQuery and Bootstrap can be found at `/dist/index.html`.

## Plugins

- [navire-express](https://github.com/claude-abounegm/navire-express)
