import express = require("express");
import NavItem = require("./NavItem");

declare class Nav<T = object> extends NavItem<T> {
  constructor(opts?: Nav.CtorOpts, initFn?: NavItem.InitFn);

  traverse(
    cb: (
      item: Nav.TraverseItem,
      index: number,
      traverseChildren: () => void
    ) => void
  ): void;

  get(path: string): NavItem | false;

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
