import e from "express";
import Nav from "../Nav";
import NavItem from "../NavItem";

declare class NavExpress {
  static init(opts: Nav.CtorOpts, initFn: NavItem.InitFn): e.Handler;
}

export = NavExpress;
