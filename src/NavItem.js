"use strict";

const _ = require("lodash");
const { normalizeUrl } = require("./utils/url");

class NavItem {
  constructor(opts) {
    if (!_.isPlainObject(opts)) {
      throw new Error("opts needs to be an object");
    }

    const { node, nav } = opts;

    if (!node) {
      throw new Error("node needs to be defined");
    }

    const { model } = node;

    let { path, level } = model;
    if (!_.isNumber(level)) {
      level = model.level = 0;
    }

    this._node = node;
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
    return this._node.model.data || {};
  }

  get type() {
    return this.data.type;
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
      let { type, children, ...rest } = init;
      if (!type) {
        throw new Error(
          `the type of the nav item needs to be defined for: ${JSON.stringify(
            init
          )}`
        );
      }

      if (type === "divider-title") {
        type = "divider";
      }

      const fnName = `append${_.startCase(type)}`;

      if (!this[fnName]) {
        throw new Error(`Could not add item with type: ${type}`);
      }

      this[fnName](rest, children);
    }
  }

  appendChild(opts, data, final = false) {
    let { index, show, match, ...rest } = opts || {};
    let { path, level, type } = data;

    const {
      _treeModel: treeModel,
      _map: map,
      _hrefs: hrefs,
      _matches: matches
    } = this._nav;

    if (!_.isNumber(level)) {
      level = this.level;

      // divider title can have children, but
      // they get the same level as title because
      // the title is usually a separator and not
      // a container. A user would use { type: 'category' }
      // instead for different behavior
      if (this.type !== "divider-title") {
        level += 1;
      }
    }

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

    data = { ...rest, ..._.omit(data, "path") };
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

    if (final) {
      // the child we're adding is final, so we return current nav
      // so the user can add more children to this nav element
      return this;
    }

    return navItem;
  }

  appendDivider(opts, init) {
    let { title, icon } = (opts = opts || {});

    if (_.isString(opts)) {
      title = opts;
      opts = {};
    }

    if (!_.isPlainObject(opts)) {
      throw new Error("opts needs to be an object");
    }

    const index = this._node.children.length + 1;

    if (title) {
      const navItem = this.appendChild(opts, {
        title,
        icon,
        path: [title],
        type: "divider-title"
      });

      navItem.append(init);

      return navItem;
    }

    const type = "divider";
    return this.appendChild(opts, { icon, type, path: [type, index] }, true);
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
        href,
        icon,
        path: [title],
        type: "link"
      },
      true
    );

    return this;
  }

  appendCategory(opts, init) {
    if (!_.isPlainObject(opts)) {
      throw new Error("opts needs to be an object");
    }

    let { title, icon } = opts || {};

    if (_.isString(opts)) {
      title = opts;
      opts = {};
    }

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

  get _isRootNode() {
    return false;
  }

  _constructPath(...items) {
    const path = [];
    if (this.path) {
      path.push(this.path);
    }
    path.push(...items);

    return path.join(".");
  }

  _generateId(type, path) {
    let id = `${type}`;

    if (path) {
      id = `${id}-${path}`;
    } else {
      const hash = generateTimeBasedHash();
      id = `${id}-${hash}`;
    }

    return id.toLowerCase().replace(/[\s\.]+/g, "-");
  }
}

function generateTimeBasedHash(hashLength = 6) {
  if (!_.isNumber(hashLength)) {
    throw new Error("hashLength needs to be a number greater than zero");
  }

  const { length } = _.reverse(String(Date.now()));
  hashLength = _.clamp(hashLength, 1, length);

  return dateStr.slice(0, hashLength);
}

module.exports = NavItem;
