import express from "express";

declare class NavItem<DataType = {}> {
  readonly id: string;
  readonly path: string;
  readonly level: number;
  readonly final: boolean;
  readonly data: DataType;

  activate(): void;

  append(init: NavItem.Init): void;

  appendLink(opts: NavItem.LinkOpts): NavItem;
  appendCategory(opts: NavItem.CategoryOpts, init?: NavItem.Init): NavItem;

  appendDivider(opts: NavItem.DividerOpts, init?: NavItem.Init): NavItem;
  appendDivider(): NavItem;
  appendDivider(title: string, init?: NavItem.Init): NavItem;
}

export = NavItem;

declare namespace NavItem {
  interface AppendOpts {
    index?: number;
    show?: boolean | (() => boolean);
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

  interface LinkObjOpts extends LinkOpts {
    type: "link";
  }

  interface DividerObjOpts extends DividerOpts {
    type: "divider";
    children?: CombinedObjOpts[];
  }

  interface CategoryObjOpts extends CategoryOpts {
    type: "category";
    children?: CombinedObjOpts[];
  }

  type CombinedObjOpts = LinkObjOpts | DividerObjOpts | CategoryObjOpts;

  type InitFnVoid = (nav: NavItem) => void;
  type InitFnReturnArray = (nav: NavItem) => CombinedObjOpts[];
  type Init =
    | InitFnVoid
    | InitFnReturnArray
    | CombinedObjOpts
    | CombinedObjOpts[];
}
