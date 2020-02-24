"use strict";

const _ = require("lodash");
const TreeModel = require("tree-model");
const { normalizeUrl } = require("./utils/url");
const { generateId } = require("./utils/hash");

class NavireItem {
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

    if (!_.isInteger(level)) {
      throw new Error("level needs to be an integer");
    }

    /** @type {TreeModel.Model<{}>} */
    this._node = node;
    this._path = path;
    this._level = level;
    this._nav = nav;

    node.model.nav = this;
  }

  get path() {
    return this._path;
  }

  get level() {
    return this._level;
  }

  get final() {
    return this._model.final;
  }

  get parent() {
    return this._model.parent || null;
  }

  get active() {
    const activePath = this._nav._activeNavItemPath || "";

    return activePath.startsWith(this.path);
  }

  get data() {
    return this._model.data || {};
  }

  get type() {
    return this.data.type;
  }

  get length() {
    return this._node.children.length;
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

  appendChild(opts, final = false) {
    let { index, show, path, level, ...data } = opts || {};
    let { match, type } = data;

    const {
      _treeModel: treeModel,
      _map: map,
      _hrefs: hrefs,
      _matches: matches
    } = this._nav;

    if (!_.isNumber(level)) {
      level = this.level;

      // divider title can have children, but they get the same level as
      // title because the title is usually a separator and not a container.
      // A user would use { type: 'category' } instead for different behavior
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

    const id = generateId(type, path);

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
        data,
        parent: this
      })
    );

    if (_.isNumber(index)) {
      node.setIndex(index);
    }

    const navItem = new NavireItem({
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
    let { title } = (opts = opts || {});

    if (_.isString(opts)) {
      title = opts;
      opts = {};
    }

    if (!_.isPlainObject(opts)) {
      throw new Error("opts needs to be an object");
    }

    const index = this.length + 1;

    if (title) {
      const navItem = this.appendChild({
        ...opts,
        title,
        path: [title],
        type: "divider-title"
      });

      navItem.append(init);

      return navItem;
    }

    const type = "divider";
    return this.appendChild({ ...opts, type, path: [type, index] }, true);
  }

  appendLink(opts) {
    if (!_.isPlainObject(opts)) {
      throw new Error("opts needs to be an object");
    }

    const { title } = opts;

    if (!_.isString(title)) {
      throw new Error("title needs to be a string");
    }

    this.appendChild(
      {
        ...opts,
        title,
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

    const navItem = this.appendChild({
      ...opts,
      title,
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

  get _model() {
    return this._node.model;
  }

  _constructPath(...items) {
    const path = [];
    if (this.path) {
      path.push(this.path);
    }
    path.push(...items);

    return path.join(".");
  }
}

module.exports = NavireItem;
