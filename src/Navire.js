"use strict";

const _ = require("lodash");
const TreeModel = require("tree-model");
const NavireItem = require("./NavireItem");
const { normalizeUrl } = require("./utils/url");

class Navire {
  constructor(init, opts) {
    const { props } = opts || {};

    const treeModel = new TreeModel();
    this._treeModel = treeModel;

    this._map = {};
    this._hrefs = {};
    this._matches = [];
    this._showArgs = [];
    this._props = { ...props };

    const rootNode = treeModel.parse({ root: true, path: "", level: -1 });
    this._node = rootNode;

    const nav = new NavireItem({
      node: rootNode,
      navire: this
    });

    nav._isRootNode = true;

    this._navireItem = nav;

    if (_.isArray(init) || _.isFunction(init)) {
      nav.append(init);
    }
  }

  append() {
    return this._navireItem.append(...arguments);
  }

  appendLink() {
    return this._navireItem.appendLink(...arguments);
  }

  appendCategory() {
    return this._navireItem.appendCategory(...arguments);
  }

  appendDivider() {
    return this._navireItem.appendDivider(...arguments);
  }

  get length() {
    return this._navireItem.length;
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
      const { show, path, level, data, id, nav } = node.model;
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

      const item = {
        ...data,
        id,
        level,
        index,
        active: nav.active,
        path
      };

      return cb.call(nav, item, () => traverseChildren(node));
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

    for (const [, nav] of _.toPairs(this._map)) {
      const { data } = nav;
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
          return nav;
        }

        allItems.push(nav);
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
    return this._activeNavireItemPath || null;
  }

  build(transform) {
    return this.traverse((item, traverseChildren) => {
      for (let [key, value] of _.toPairs(item)) {
        if (_.isFunction(transform)) {
          value = transform(key, value);
        }

        if (_.isUndefined(value)) {
          delete item[key];
        } else if (item[key] !== value) {
          item[key] = value;
        }
      }

      const children = traverseChildren();

      if (children.length) {
        item.children = children;
      }

      return item;
    });
  }

  serialize() {
    const init = this.build((key, value) => {
      if (value instanceof RegExp) {
        const [, pattern, flags] = value.toString().match(/^\/(.+)\/([a-z]*)$/);
        return { $type: "regex", pattern, flags };
      }

      return value;
    });

    let serialized = JSON.stringify({
      init,
      props: this.props
    });

    serialized = Buffer.from(serialized, "utf8").toString("base64");

    return `navire:${serialized}`;
  }

  static deserialize(data) {
    if (!_.isString(data)) {
      throw new Error("data needs to be a navire serialized string");
    }

    try {
      data = data.split("navire:")[1];
      data = Buffer.from(data, "base64").toString("utf8");

      data = JSON.parse(data, (key, value) => {
        if (_.isPlainObject(value)) {
          const { $type } = value;

          if ($type === "regex") {
            return RegExp(value.pattern, value.flags || "");
          }
        }

        return value;
      });
    } catch (e) {
      throw new Error("invalid navire serialized data");
    }

    return new this(data.init, data.props);
  }
}

module.exports = Navire;
