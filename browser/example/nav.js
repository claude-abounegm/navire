"use strict";

function init() {
  const nav = new Nav(nav => {
    nav.appendLink({ title: "Dashboard", href: "/" });
    nav.appendLink({ title: "Users", href: "/users" });
  });

  // find a nav item based on the browser's current location
  // and activate it if it was found.
  const activeNavItem = nav.findByHref(window.location.pathname);
  if (activeNavItem) {
    activeNavItem.activate();
  }

  const navTree = nav.traverse((item, traverseChildren) => {
    const { type, title, href, active } = item;

    if (type === "link") {
      return createNavLink({ title, href, active });
    }
  });

  $("nav ul").append(navTree);

  function createNavLink({ title, href, active }) {
    // <li class="nav-item"></li>
    const $listItem = $("<li>");
    $listItem.addClass("nav-item");
    if (active) {
      $listItem.addClass("active");
    }

    const $link = createAnchor({ title, href });
    $link.addClass("nav-link");
    // add link to the <li> content
    $listItem.html($link);

    return $listItem;
  }

  function createAnchor({ title, ...rest }) {
    // <a href="{href}" class="nav-link">{title}</a>
    const $link = $("<a>");
    $link.text(title);
    $link.attr({ ...rest });

    return $link;
  }
}

init();
