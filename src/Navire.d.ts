import express from "express";
import NavireItem from "./NavireItem";

declare class Navire<
  PropsType = {},
  DataType = {}
> extends NavireItem.AppendFunctions {
  constructor(
    init?: Navire.InitMultiple<PropsType>,
    opts?: Navire.CtorOpts<PropsType>
  );

  traverse<T>(
    cb: (
      this: NavireItem,
      item: Navire.TraverseItem,
      traverseChildren: <T>() => Navire.TraverseRet<T>
    ) => Navire.TraverseRet<T>
  ): Navire.TraverseRet<T>;

  get(path: string): Navire.FindRet;

  findByTitle(title: string | RegExp, all: true): Navire.FindRet[];
  findByTitle(title: string | RegExp, all?: false): Navire.FindRet;

  findByHref(opts: { href: string }): Navire.FindRet;
  findByHref(opts: { match: RegExp }): Navire.FindRet;
  findByHref(href: string): Navire.FindRet;
  findByHref(match: RegExp): Navire.FindRet;

  serialize(): string;

  readonly props: PropsType & Navire.Props;
  readonly activeNavPath: string | null;

  static deserialize(data: string): Navire;
}

export = Navire;

declare namespace Navire {
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

  type InitFnVoid<PropsType> = (nav: Navire<PropsType>) => void;
  type InitFnReturnArray<PropsType> = (
    nav: Navire<PropsType>
  ) => NavireItem.CombinedObjOpts[];

  type InitMultiple<PropsType> =
    | InitFnVoid<PropsType>
    | InitFnReturnArray<PropsType>
    | NavireItem.CombinedObjOpts[];

  type Init<PropsType> = InitMultiple | NavireItem.CombinedObjOpts;

  type FindRet = NavireItem | false;
}
