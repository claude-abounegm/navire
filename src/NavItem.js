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

  get data() {
    return this._node.model;
  }

  append(itemsOrInitFn) {
    if (_.isFunction(itemsOrInitFn)) {
      const ret = itemsOrInitFn(this);

      if (_.isArray(ret)) {
        this.append(ret);
      }
    } else if (_.isArray(itemsOrInitFn)) {
      itemsOrInitFn.forEach(item => this.append(item));
    } else if (_.isPlainObject(itemsOrInitFn)) {
      const { type, children, ...rest } = itemsOrInitFn;
      const fnName = `append${_.startCase(type)}`;

      if (!this[fnName]) {
        throw new Error(`could not add item with type: ${type}`);
      }

      this[fnName](rest, children);
    }
  }

  appendDivider(opts, initFn) {
    let title;

    if (_.isPlainObject(opts)) {
      title = opts.title;
    } else if (_.isString(opts)) {
      title = opts;
      opts = {};
    } else {
      opts = {};
    }

    const index = this._nextIndex;

    const { icon } = opts;

    if (title) {
      const navItem = this._appendChild(opts, {
        title,
        icon,
        path: [title, index],
        type: "divider-title"
      });

      navItem.append(initFn);

      return navItem;
    }

    const type = "divider";
    this._appendChild(opts, { icon, type, path: [type, index] }, true);
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

    navItem.append(initFn);

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
    const { index, show, match } = opts || {};

    let { path, level = this.level + 1, type } = props;
    const { _treeModel, _map, _hrefs, _matches } = this._nav;

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

    props = _.omit(props, "path");
    if (match instanceof RegExp) {
      _matches.push({ match, path });
      props.match = match;
    }

    const node = this._node.addChild(
      _treeModel.parse({
        id,
        show,
        path,
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
