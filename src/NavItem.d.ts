import express = require("express");

declare class NavItem {
  readonly id: string;
  readonly path: string;
  readonly level: number;
  readonly data: object;

  activate(): void;

  appendDivider(opts?: NavItem.AppendOpts): NavItem;
  appendLink(opts: NavItem.LinkOpts): NavItem;

  appendDivider(
    optsOrTitle: NavItem.TitleOpts | string,
    initFn?: NavItem.InitFn
  ): NavItem;
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
