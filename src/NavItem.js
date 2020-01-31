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
    return this._node.model.data;
  }

  append(init) {
    if (_.isFunction(init)) {
      const ret = init(this);

      if (_.isArray(ret)) {
        this.append(ret);
      }
    } else if (_.isArray(init)) {
      init.forEach(item => this.append(item));
    } else if (_.isPlainObject(init)) {
      const { type, children, ...rest } = init;
      const fnName = `append${_.startCase(type)}`;

      if (!this[fnName]) {
        throw new Error(`Could not add item with type: ${type}`);
      }

      this[fnName](rest, children);
    }
  }

  appendDivider(opts, init) {
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
      const navItem = this.appendChild(opts, {
        title,
        icon,
        path: [title, index],
        type: "divider-title"
      });

      navItem.append(init);

      return navItem;
    }

    const type = "divider";
    this.appendChild(opts, { icon, type, path: [type, index] }, true);
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

    this.appendChild(
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

  appendCategory(opts, init) {
    let { title } = opts || {};

    if (_.isString(opts)) {
      title = opts;
      opts = {};
    }

    const { icon } = opts;

    const navItem = this.appendChild(opts, {
      title,
      icon,
      path: [title],
      type: "category"
    });

    navItem.append(init);

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

  appendChild(opts, data, final = false) {
    let { index, show, match } = opts || {};
    let { path, level = this.level + 1, type } = data;
    const {
      _treeModel: treeModel,
      _map: map,
      _hrefs: hrefs,
      _matches: matches
    } = this._nav;

    if (_.isArray(path)) {
      path = this._constructPath(...path);
    } else if (!_.isString(path)) {
      throw new Error("path needs to be an array or a string");
    }

    if (map[path]) {
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

    data = _.omit(data, "path");
    if (_.isString(match)) {
      match = RegExp(match);
    }

    if (match instanceof RegExp) {
      matches.push({ match, path });
      data.match = match;
    }

    const node = this._node.addChild(
      treeModel.parse({
        id,
        show,
        path,
        level,
        final,
        data
      })
    );

    if (_.isNumber(index)) {
      node.setIndex(index);
    }

    const navItem = new NavItem({
      node,
      nav: this._nav
    });

    map[path] = navItem;

    if (data.href) {
      const { href } = data;

      hrefs[href] = path;

      const { href: normalizedHref } = normalizeUrl(href);
      if (normalizedHref !== href) {
        hrefs[normalizedHref] = path;
      }
    }

    return navItem;
  }
}

module.exports = NavItem;
