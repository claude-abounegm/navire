import e from "express";
import Nav from "../Nav";
import NavItem from "../NavItem";

declare class NavExpress {
  static init<T>(opts: Nav.CtorOpts<T>, initFn: NavItem.InitFn): e.Handler;
}

export = NavExpress;
