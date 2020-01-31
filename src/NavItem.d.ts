import express from "express";

declare class NavItem<T = object> {
  readonly id: string;
  readonly path: string;
  readonly level: number;
  readonly data: T;
  readonly final: boolean;

  activate(): void;

  append(initFn: NavItem.InitFn): void;
  append(initFn: NavItem.InitFnReturnArray): void;
  append(item: NavItem.CombinedObjOpts): void;
  append(items: NavItem.CombinedObjOpts[]): void;

  appendLink(opts: NavItem.LinkOpts): NavItem;
  appendCategory(opts: NavItem.CategoryOpts, initFn?: NavItem.InitFn): NavItem;
  appendDivider(opts: NavItem.DividerOpts, initFn?: NavItem.InitFn): NavItem;

  appendDivider(): NavItem;
  appendDivider(title: string, initFn?: NavItem.InitFn): NavItem;
}

export = NavItem;

declare namespace NavItem {
  interface AppendOpts {
    index?: number;
    show?: () => boolean;
  }

  interface TitleOpts extends AppendOpts {
    title: string;
    icon?: string;
  }

  interface CategoryOpts extends TitleOpts {
    icon?: string;
  }

  interface LinkOpts extends TitleOpts {
    href: string;
    icon?: string;
    match?: RegExp;
  }

  interface DividerOpts extends AppendOpts {
    title?: string;
  }

  type InitFn = (nav: NavItem) => void;
  type InitFnReturnArray = (nav: NavItem) => CombinedObjOpts[];

  type LinkObjOpts = { type: "link" } & NavItem.LinkOpts;

  type DividerObjOpts = {
    type: "divider";
    children?: CombinedObjOpts[];
  } & NavItem.DividerOpts;

  type CategoryObjOpts = {
    type: "category";
    children?: CombinedObjOpts[];
  } & NavItem.CategoryOpts;

  type CombinedObjOpts =
    | NavItem.LinkObjOpts
    | NavItem.DividerOpts
    | NavItem.CategoryOpts;
}
