import express from "express";
import NavItem from "./NavItem";

declare class Nav<PropsType = {}, DataType = {}> extends NavItem<DataType> {
  constructor(init?: Nav.Init<PropsType>, opts?: Nav.CtorOpts<PropsType>);

  traverse<T>(
    cb: (
      item: Nav.TraverseItem,
      traverseChildren: <T>() => Nav.TraverseRet<T>
    ) => Nav.TraverseRet<T>
  ): Nav.TraverseRet<T>;

  get(path: string): Nav.FindRet;

  findByTitle(title: string | RegExp, all: true): Nav.FindRet[];
  findByTitle(title: string | RegExp, all?: false): Nav.FindRet;

  findByHref(opts: { href: string }): Nav.FindRet;
  findByHref(opts: { match: RegExp }): Nav.FindRet;
  findByHref(href: string): Nav.FindRet;
  findByHref(match: RegExp): Nav.FindRet;

  serialize(): string;

  readonly props: PropsType & Nav.Props;
  readonly length: number;
  readonly activeNavPath: string | null;

  static deserialize(data: string): Nav;
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

  type FindRet = NavItem | false;
}
