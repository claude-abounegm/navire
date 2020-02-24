import express from "express";

declare class NavireItem<DataType = {}> {
  readonly id: string;
  readonly path: string;
  readonly level: number;
  readonly final: boolean;
  readonly data: DataType;
  readonly length: number;
  readonly active: boolean;
  readonly parent: NavireItem | null;

  activate(): void;

  append(init: NavItem.Init): void;

  appendLink(opts: NavItem.LinkOpts): NavireItem;
  appendCategory(opts: NavItem.CategoryOpts, init?: NavItem.Init): NavireItem;

  appendDivider(opts: NavItem.DividerOpts, init?: NavItem.Init): NavireItem;
  appendDivider(): NavireItem;
  appendDivider(title: string, init?: NavItem.Init): NavireItem;
}

export = NavireItem;

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
    children?: Init;
  }

  interface CategoryObjOpts extends CategoryOpts {
    type: "category";
    children?: Init;
  }

  type CombinedObjOpts = LinkObjOpts | DividerObjOpts | CategoryObjOpts;

  type InitFnVoid = (nav: NavireItem) => void;
  type InitFnReturnArray = (nav: NavireItem) => CombinedObjOpts[];
  type Init =
    | InitFnVoid
    | InitFnReturnArray
    | CombinedObjOpts
    | CombinedObjOpts[];
}
