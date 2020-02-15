# navire

Simple, elegant navigation

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
```

### Example

```javascript
const nav = new Nav(
  nav => [
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
  ],
  { props: { title: "Foo" } }
);
```

## Usage with React.js

An example on using this project with React.js can be found at: [navire-react-demo](https://github.com/claude-abounegm/navire-react-demo).

## Usage with jQuery

An example on using this project with jQuery and Bootstrap can be found at `/dist/index.html`.

## Plugins

- [navire-express](https://github.com/claude-abounegm/navire-express)
