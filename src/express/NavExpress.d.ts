import e from "express";
import Nav from "../Nav";

declare class NavExpress {
  static init<PropsType>(
    opts?: Nav.CtorOpts<PropsType>,
    init?: Nav.Init<PropsType>
  ): e.Handler;
}

export = NavExpress;
