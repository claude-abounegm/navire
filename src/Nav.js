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

      const active =
        this._activeNavItemPath && this._activeNavItemPath.startsWith(path);

      const item = {
        ...props,
        level,
        id,
        active,
        path
      };

      return cb.call(this, item, index, () => traverseChildren(node));
    };

    function traverseChildren(node) {
      return node.children.map((node, index) => _traverse(node, index));
    }

    return traverseChildren(this._node);
  }

  get(path) {
    return this._map[path] || false;
  }
}

module.exports = Nav;
