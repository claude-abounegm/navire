import express from "express";
import NavItem from "./NavItem";
import NavExpress from "./express/NavExpress";

declare class Nav<PropsType = {}, DataType = {}> extends NavItem<DataType> {
  constructor(opts?: Nav.CtorOpts<PropsType>, init?: Nav.Init<PropsType>);

  traverse<T>(
    cb: (
      item: Nav.TraverseItem,
      traverseChildren: <T>() => Nav.TraverseRet<T>
    ) => Nav.TraverseRet<T>
  ): Nav.TraverseRet<T>;

  get(path: string): NavItem | false;

  find(opts: { href: string }): NavItem | false;
  find(opts: { match: RegExp }): NavItem | false;
  find(href: string): NavItem | false;
  find(match: RegExp): NavItem | false;

  readonly props: PropsType & Nav.Props;
  readonly length: number;
  readonly activeNavPath: string | null;

  static NavExpress: typeof NavExpress;
}

export = Nav;

declare namespace Nav {
  type TraverseRet<T> = void | T | T[];

  interface CtorOpts<T> {
    props?: Props;
  }

  interface TraverseItem {
    readonly id: string;
    readonly type: string;
    readonly level: number;
    readonly index: number;
    readonly active: boolean;

    readonly [key: string]: any;
  }

  interface Props {
    title?: string;
    icon?: string;
    href?: string;
    classes?: string;
  }

  type InitFnVoid<PropsType> = (nav: Nav<PropsType>) => void;
  type InitFnReturnArray<PropsType> = (
    nav: Nav<PropsType>
  ) => NavItem.CombinedObjOpts[];

  type Init<PropsType> =
    | InitFnVoid<PropsType>
    | InitFnReturnArray<PropsType>
    | NavItem.CombinedObjOpts
    | NavItem.CombinedObjOpts[];
}

declare global {
  namespace Express {
    interface Response {
      nav: Nav;
    }
  }
}
