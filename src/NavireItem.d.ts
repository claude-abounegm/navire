import express from "express";

declare class NavireItem<DataType = {}> extends NavireItem.AppendFunctions {
  readonly id: string;
  readonly path: string;
  readonly level: number;
  readonly final: boolean;
  readonly data: DataType;
  readonly length: number;
  readonly active: boolean;
  readonly parent: NavireItem | null;

  activate(): void;
}

export = NavireItem;

declare namespace NavireItem {
  class AppendFunctions {
    append(init: NavireItem.Init): void;

    appendLink(opts: NavireItem.LinkOpts): NavireItem;
    appendCategory(
      opts: NavireItem.CategoryOpts,
      init?: NavireItem.Init
    ): NavireItem;

    appendDivider(
      opts: NavireItem.DividerOpts,
      init?: NavireItem.Init
    ): NavireItem;
    appendDivider(): NavireItem;
    appendDivider(title: string, init?: NavireItem.Init): NavireItem;
  }

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
