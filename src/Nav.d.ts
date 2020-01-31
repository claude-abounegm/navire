import express from "express";
import NavItem from "./NavItem";

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

  find(opts: { href: string }): NavItem | false;
  find(opts: { match: RegExp }): NavItem | false;
  find(href: string): NavItem | false;
  find(match: RegExp): NavItem | false;

  readonly props: Nav.Props;
  readonly length: number;
  readonly activeNavPath: string | null;
}

export = Nav;

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
