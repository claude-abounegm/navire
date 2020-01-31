"use strict";

const _ = require("lodash");
const { normalizeUrl } = require("./utils/url");

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

    const index = this._nextIndex;

    if (title) {
      const navItem = this._appendChild(opts, {
        level: 0,
        title,
        path: [title, index],
        type: "divider-title"
      });

      if (_.isFunction(initFn)) {
        initFn(navItem);
      }

      return navItem;
    }

    const type = "divider";
    this._appendChild(opts, { type, path: [type, index] }, true);
    // the child we're adding is final, so we return current nav
    // so the user can add more children to this nav element
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

    this._appendChild(
      opts,
      {
        title,
        href: href || "#",
        icon,
        path: [title],
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

    const navItem = this._appendChild(opts, {
      title,
      icon,
      path: [title],
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

  get _nextIndex() {
    return this._node.children.length + 1;
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

    let { path, level = this.level + 1, type } = props;
    const { _treeModel, _map, _hrefs } = this._nav;

    if (_.isArray(path)) {
      path = this._constructPath(...path);
    } else if (!_.isString(path)) {
      throw new Error("path needs to be an array or a string");
    }

    if (_map[path]) {
      throw new Error(`an item named "${path}" is already in use`);
    }

    if (this.final) {
      throw new Error(`nav item ${this.path} cannot have children`);
    }

    path = path.trim();
    if (!path) {
      throw new Error("path needs to be a string");
    }

    const id = this._generateId(type, path);

    const node = this._node.addChild(
      _treeModel.parse({
        id,
        show,
        path,
        level,
        final,
        props: _.omit(props, "path")
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
      const { href } = props;

      _hrefs[href] = path;

      const { href: normalizedHref } = normalizeUrl(href);
      if (normalizedHref !== href) {
        _hrefs[normalizedHref] = path;
      }
    }

    return navItem;
  }
}

module.exports = NavItem;
