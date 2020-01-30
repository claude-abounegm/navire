"use strict";

const _ = require("lodash");

class NavItem {
  constructor(opts) {
    const { node, nav } = opts;
    const { model } = node;

    if (!_.isNumber(model.level)) {
      model.level = 0;
    }

    this._node = node;

    const { path, level } = node.model;

    this._path = path;
    this._level = level;

    this._nav = nav;

    node.model.navItem = this;
  }

  get path() {
    return this._path;
  }

  get level() {
    return this._level;
  }

  get final() {
    return this._node.model.final;
  }

  appendDivider(opts, initFn) {
    let title;

    if (_.isPlainObject(opts)) {
      title = opts.title;
    } else if (_.isString(opts)) {
      title = opts;
      opts = {};
    }

    const index = this._node.children.length + 1;

    if (title) {
      const path = this._constructPath(title, index);

      const navItem = this._appendChild(opts, {
        level: 0,
        title,
        path,
        type: "divider-title"
      });

      if (_.isFunction(initFn)) {
        initFn(navItem);
      }

      return navItem;
    }

    const type = "divider";
    const path = this._constructPath(type, index);
    this._appendChild(opts, { type, path }, true);
    return this;
  }

  appendLink(opts) {
    if (!_.isPlainObject(opts)) {
      throw new Error("opts needs to be an object");
    }

    const { title, href, icon } = opts;

    if (!_.isString(title)) {
      throw new Error("title needs to be a string");
    }

    const path = this._constructPath(title);

    this._appendChild(
      opts,
      {
        title,
        href: href || "#",
        icon,
        path,
        type: "link"
      },
      true
    );

    return this;
  }

  appendCategory(opts, initFn) {
    let title;

    if (_.isPlainObject(opts)) {
      title = opts.title;
    } else if (_.isString(opts)) {
      title = opts;
      opts = {};
    } else {
      throw new Error("opts needs to be an object or a string");
    }

    const { icon } = opts;

    const path = this._constructPath(title);

    const navItem = this._appendChild(opts, {
      title,
      icon,
      path,
      type: "category"
    });

    if (_.isFunction(initFn)) {
      initFn(navItem);
    }

    return navItem;
  }

  activate() {
    this._nav._activeNavItemPath = this.path;
  }

  _constructPath(...items) {
    const path = [...items];
    if (this.path !== "") {
      path.unshift(this.path);
    }

    return path.join(".");
  }

  _generateId(type, path) {
    let id = `${type}`;

    function normalize(str) {
      return str.toLowerCase().replace(/[\s\.]+/g, "-");
    }

    if (path) {
      id = `${id}-${path}`;
    } else {
      id = `${id}-${Date.now()}`;
    }

    return normalize(id);
  }

  _appendChild(opts, props, final) {
    const { index, show } = opts || {};

    const { path, level = this.level + 1, type } = props;
    const { _treeModel, _map, _hrefs } = this._nav;

    if (path && _map[path]) {
      throw new Error(`an item named "${path}" is already in use`);
    }

    if (this.final) {
      throw new Error(`nav item ${this.path} cannot have children`);
    }

    delete props.path;

    const id = this._generateId(type, path);

    const node = this._node.addChild(
      _treeModel.parse({
        id,
        show,
        path: path || this.path,
        level,
        final,
        props
      })
    );

    if (_.isNumber(index)) {
      node.setIndex(index);
    }

    const navItem = new NavItem({
      node,
      nav: this._nav
    });

    _map[path] = navItem;

    if (props.href) {
      _hrefs[props.href] = path;
    }

    return navItem;
  }
}

module.exports = NavItem;
