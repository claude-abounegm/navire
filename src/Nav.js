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

      return cb.call(
        this,
        {
          ...props,
          level,
          id,
          active
        },
        index,
        () => nodeForEach(node)
      );
    };

    function nodeForEach(node) {
      const result = [];
      node.children.forEach((node, index) => {
        result.push(_traverse(node, index));
      });
      return result;
    }

    return nodeForEach(this._node);
  }

  get(path) {
    return this._map[path] || false;
  }
}

module.exports = Nav;
