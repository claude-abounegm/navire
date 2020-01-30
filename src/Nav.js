"use strict";

const _ = require("lodash");
const TreeModel = require("tree-model");

const NavItem = require("./NavItem");

class Nav extends NavItem {
  constructor(opts, initFn) {
    const { props } = opts || {};

    const treeModel = new TreeModel();
    const root = treeModel.parse({ root: true, path: "" });

    super({
      node: root
    });

    this._treeModel = treeModel;
    this._nav = this;
    this._map = {};
    this._hrefs = {};
    this._props = _.isPlainObject(props) ? { ...props } : {};

    if (_.isFunction(initFn)) {
      initFn(this);
    }
  }

  get props() {
    return this._props;
  }

  traverse(cb) {
    let lastType;

    const _traverse = (node, index) => {
      const { show, path, level, props, id } = node.model;
      const { type } = props;

      if (_.isFunction(show)) {
        const showArgs = [];

        // express plugin
        if (this._express) {
          showArgs.push(...this._express);
        }

        showArgs.push(this);

        if (!show.apply(this, showArgs)) {
          return;
        }
      }

      if (type === "divider" && lastType === "divider") {
        return;
      }

      lastType = type;

      const activePath = this._activeNavItemPath || "";
      const active = activePath.startsWith(path);

      const item = {
        ...props,
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
        .filter(item => item !== null);
    }

    return traverseChildren(this._node);
  }

  get(path) {
    return this._map[path] || false;
  }

  getByHref(href) {
    const path = this._hrefs[href];
    return this.get(path);
  }

  get activeNavPath() {
    return this._activeNavItemPath || null;
  }

  get length() {
    return this.node.children.length;
  }
}

module.exports = Nav;
