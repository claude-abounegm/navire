import express = require("express");
import NavItem = require("./NavItem");

declare class Nav<T = object> extends NavItem<T> {
  constructor(opts?: Nav.CtorOpts<T>, initFn?: Nav.InitFn<T>);

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
  interface CtorOpts<T> {
    props?: Props<T>;
  }

  interface TraverseItem {
    readonly id: string;
    readonly type: string;
    readonly level: number;
    readonly active: boolean;

    readonly [key: string]: any;
  }

  interface Props<T> extends T {
    title: string;

    icon?: string;
    href?: string;
    classes?: string;

    [name: string]: string;
  }

  type InitFn<T> = (nav: Nav<T>) => void;
}

declare global {
  namespace Express {
    interface Response {
      nav: Nav;
    }
  }
}

export = Nav;
