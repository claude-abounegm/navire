"use strict";

const _ = require("lodash");
const TreeModel = require("tree-model");
const NavItem = require("./NavItem");
const { normalizeUrl } = require("./utils/url");

class Nav extends NavItem {
  constructor(init, opts) {
    const { props } = opts || {};

    const treeModel = new TreeModel();
    const rootNode = treeModel.parse({ root: true, path: "", level: -1 });

    super({ node: rootNode });

    this._treeModel = treeModel;

    // needed since we don't pass nav
    // to super() before initializiation
    this._nav = this;
    this._map = {};
    this._hrefs = {};
    this._matches = [];
    this._showArgs = [];
    this._props = _.isPlainObject(props) ? { ...props } : {};

    this.append(init);
  }

  get props() {
    return this._props;
  }

  traverse(cb) {
    if (!_.isFunction(cb)) {
      throw new Error("cb needs to be a function");
    }

    let lastType;

    const _traverse = (node, index) => {
      const { show, path, level, data, id } = node.model;
      const { type } = data;

      if (_.isFunction(show)) {
        const showArgs = [...this._showArgs, this];

        if (!show.apply(this, showArgs)) {
          return;
        }
      } else if (_.isBoolean(show) && !show) {
        return;
      }

      // no duplicate dividers
      if (type === "divider" && lastType === type) {
        return;
      }

      lastType = type;

      const activePath = this._activeNavItemPath || "";
      const active = activePath.startsWith(path);

      const item = {
        ...data,
        id,
        level,
        index,
        active,
        path
      };

      return cb.call(this, item, () => traverseChildren(node));
    };

    function traverseChildren(node) {
      return node.children
        .map((node, index) => _traverse(node, index))
        .filter(item => !_.isUndefined(item) && item !== null);
    }

    const ret = traverseChildren(this._node);
    if (ret.length) {
      return ret;
    }
  }

  get(path) {
    return this._map[path] || false;
  }

  findByTitle(title, all = false) {
    if (!title) {
      throw new Error("title needs to be a string or regex");
    }

    const allItems = [];

    for (const [, navItem] of _.toPairs(this._map)) {
      const { data } = navItem;
      let found = false;

      if (title instanceof RegExp) {
        if (title.test(data.title)) {
          found = true;
        }
      } else if (title === data.title) {
        found = true;
      }

      if (found) {
        if (!all) {
          return navItem;
        }

        allItems.push(navItem);
      }
    }

    if (allItems.length) {
      return allItems;
    }

    return false;
  }

  findByHref(opts) {
    let { href, match } = opts || {};

    if (_.isString(opts)) {
      href = opts;
    } else if (opts instanceof RegExp) {
      match = opts;
    }

    if (match && !(match instanceof RegExp)) {
      match = RegExp(match);
    }

    if (!href && !match) {
      throw new Error("href or match need to be specified");
    }

    let pathFound;

    if (href) {
      const { href: normalizedHref } = normalizeUrl(href);
      pathFound = this._hrefs[normalizedHref];
    }

    if (!pathFound && match) {
      for (const [href, path] of _.toPairs(this._hrefs)) {
        if (match.test(href)) {
          pathFound = path;
          break;
        }
      }
    }

    if (!pathFound && href) {
      for (const { match, path } of this._matches) {
        if (match.test(href)) {
          pathFound = path;
          break;
        }
      }
    }

    return this.get(pathFound);
  }

  get activeNavPath() {
    return this._activeNavItemPath || null;
  }

  get length() {
    if (!this.node) {
      return 0;
    }

    const { children } = this.node;

    return (children && children.length) || 0;
  }

  build(transform) {
    return this.traverse((item, traverseChildren) => {
      let { type } = item;

      const ret = {
        ...item,
        type,
        children: traverseChildren()
      };

      for (let [key, value] of _.toPairs(ret)) {
        if (_.isFunction(transform)) {
          value = transform(key, value);
        }

        if (_.isUndefined(value)) {
          delete ret[key];
        } else if (ret[key] !== value) {
          ret[key] = value;
        }
      }

      if (!ret.children.length) {
        delete ret.children;
      }

      return ret;
    });
  }

  serialize() {
    let ret = {
      init: this.build((key, value) => {
        if (value instanceof RegExp) {
          return { $type: "regex", value: value.toString() };
        }
        return value;
      }),
      props: this.props
    };

    ret = Buffer.from(JSON.stringify(ret), "utf8").toString("base64");

    return `navire:${ret}`;
  }

  static deserialize(data) {
    data = data.split("navire:")[1];

    data = Buffer.from(data, "base64").toString("utf8");

    const { init, props } = JSON.parse(data, (key, value) => {
      if (_.isPlainObject(value)) {
        if (value.$type === "regex") {
          const [, pattern, flags] = /^\/(.+)\/([a-z]*)$/.exec(value.value);
          return RegExp(pattern, flags || "");
        }
      }

      return value;
    });

    return new this(init, props);
  }

  get _isRootNode() {
    return true;
  }
}

module.exports = Nav;
