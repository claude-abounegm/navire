# navire

Simple, elegant navigation

Navire ships with typings out of the box.
Navire can be used both server and client-side.

## Installation

```bash
npm i navire
```

## Usage

### npm

```javascript
const Nav = require("navire");
```

### Browser

```html
<script src="/dist/navire-browser.js"></script>
<!-- `Nav` is now a global variable. -->
```

### Instructions

`navire` uses a two-step approach to build navigation.

1. Build the full navigation tree.
2. Traverse the tree and build the front-end.

```javascript
const shouldShowElement = false;

// Initialize navire
const nav = new Nav(
  // you can pass a function, which gives you a Nav instance
  // you can also pass the array directly
  nav => [
    // this is the first link in the navigation,
    // you need to define a type.
    // The types currently supported are:
    //   ["category", "link", "divider"]
    // More details on each type can be found in the documentation.
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
      show: shouldShowElement, // can also be () => shouldShowElement
      children: () => [
        // /link1 is the first child
        { type: "link", title: "Link 1", href: "/link1" },
        // this is a "divider" with a title
        { type: "divider", title: nav.props.title },
        // /link2 has index 2
        { type: "link", title: "Link 2", href: "/link2" }
      ]
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
