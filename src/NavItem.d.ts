import express = require("express");

declare class NavItem<T = object> {
  readonly id: string;
  readonly path: string;
  readonly level: number;
  readonly data: T;

  activate(): void;

  appendLink(opts: NavItem.LinkOpts): NavItem;

  appendDivider(): NavItem;
  appendDivider(title: string, initFn?: NavItem.InitFn): NavItem;
  appendDivider(opts: NavItem.TitleOpts, initFn?: NavItem.InitFn): NavItem;

  appendCategory(opts: NavItem.CategoryOpts, initFn?: NavItem.InitFn): NavItem;
}

declare namespace NavItem {
  interface AppendOpts {
    index?: number;
    show?: (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => boolean;
  }

  interface TitleOpts extends AppendOpts {
    title: string;
  }

  interface CategoryOpts extends TitleOpts {
    icon?: string;
  }

  interface LinkOpts extends TitleOpts {
    href: string;
    icon?: string;
  }

  type InitFn = (nav: NavItem) => void;
}

export = NavItem;
