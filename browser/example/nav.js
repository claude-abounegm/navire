"use strict";

(function initNavire() {
  const searchParams = new URLSearchParams(location.search);
  const isAdmin = !!searchParams.get("admin");

  const navire = new Nav(navire => {
    navire.appendLink({ title: "Dashboard", href: "/" });
    navire.appendLink({ title: "Users", href: "/users" });
    navire.appendLink({
      title: "Admin",
      href: "/admin?admin=true",
      show: isAdmin,
      match: /\/admin/
    });
  });

  // find a nav item based on the browser's current location
  // and activate it if it was found.
  const activeNavItem = navire.findByHref(window.location.pathname);

  // if a valid nav item was found, then we can activate it
  if (activeNavItem) {
    activeNavItem.activate();
  }

  $("nav ul").append(
    navire.traverse((item, traverseChildren) => {
      const { type, title, href, active } = item;

      if (type === "link") {
        // can be found in /utils/bootstrap.js
        return createNavLink({ title, href, active });
      }
    })
  );
})();
