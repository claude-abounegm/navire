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

      cb.call(
        this,
        {
          ...props,
          level,
          id,
          active
        },
        index,
        () => {
          node.children.forEach(_traverse);
        }
      );
    };

    this._node.children.forEach(_traverse);
  }

  get(path) {
    return this._map[path] || false;
  }
}

module.exports = Nav;
