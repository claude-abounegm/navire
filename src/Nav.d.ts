import express = require("express");
import NavItem = require("./NavItem");

declare class Nav extends NavItem {
  constructor(opts?: Nav.CtorOpts, initFn: (nav: Nav) => void);
  static express(opts: Nav.CtorOpts, initFn: NavItem.InitFn): express.Handler;

  traverse(
    cb: (item: Nav.TraverseItem, index: number, traverse: () => void) => void
  ): void;

  get(path: string): NavItem | false;

  express(): express.Handler;

  readonly props: Nav.Props;
}

declare namespace Nav {
  interface CtorOpts {
    props?: Props;
  }

  interface TraverseItem {
    readonly id: string;
    readonly type: string;
    readonly level: number;
    readonly active: boolean;

    readonly [key: string]: any;
  }

  interface Props {
    title: string;

    icon?: string;
    href?: string;
    classes?: string;

    [name: string]: string;
  }
}

declare global {
  namespace Express {
    interface Response {
      nav: Nav;
    }
  }
}

export = Nav;
