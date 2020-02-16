"use strict";

function createNavAnchor({ title, ...rest }) {
  // <a href="{href}" class="nav-link">{title}</a>
  const $link = $("<a>");
  $link.text(title);
  $link.addClass("nav-link");
  $link.attr({ ...rest });

  return $link;
}

function createNavLink({ title, href, active }) {
  // <li class="nav-item"></li>
  const $listItem = $("<li>");
  $listItem.addClass("nav-item");
  if (active) {
    $listItem.addClass("active");
  }

  // add link to the <li> content
  $listItem.html(createNavAnchor({ title, href }));

  return $listItem;
}
