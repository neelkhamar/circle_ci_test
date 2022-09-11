import React, { useLayoutEffect } from "react";
import Link from "next/link";
import { TopMenuStyle } from "./style";

const TopMenu = () => {
  const { path } = useRouteMatch();

  useLayoutEffect(() => {
    const active = document.querySelector(".strikingDash-top-menu a.active");
    const activeDefault = () => {
      const megaMenu = active.closest(".megaMenu-wrapper");
      const hasSubMenuLeft = active.closest(".has-subMenu-left");
      if (!megaMenu) {
        active.closest("ul").previousSibling.classList.add("active");
        if (hasSubMenuLeft)
          hasSubMenuLeft.closest("ul").previousSibling.classList.add("active");
      } else {
        active
          .closest(".megaMenu-wrapper")
          .previousSibling.classList.add("active");
      }
    };
    window.addEventListener("load", active && activeDefault);
    return () => window.removeEventListener("load", activeDefault);
  }, []);

  const addParentActive = (event) => {
    document.querySelectorAll(".parent").forEach((element) => {
      element.classList.remove("active");
    });

    const hasSubMenuLeft = event.currentTarget.closest(".has-subMenu-left");
    const megaMenu = event.currentTarget.closest(".megaMenu-wrapper");
    if (!megaMenu) {
      event.currentTarget.closest("ul").previousSibling.classList.add("active");
      if (hasSubMenuLeft)
        hasSubMenuLeft.closest("ul").previousSibling.classList.add("active");
    } else {
      event.currentTarget
        .closest(".megaMenu-wrapper")
        .previousSibling.classList.add("active");
    }
  };
  return (
    <TopMenuStyle>
      <div className="strikingDash-top-menu">
        <ul>
          <li className="has-subMenu">
            <Link href="#" className="parent">
              Apps
            </Link>
            <ul className="subMenu">
              <li className="has-subMenu-left">
                <Link href="#" className="parent">
                  <div className="icon">
                    <i className="bx bx-mail-outlined"></i>
                  </div>
                  Email
                </Link>
                <ul className="subMenu">
                  <li>
                    <Link
                      onClick={addParentActive}
                      href={`${path}/email/inbox`}
                    >
                      Inbox
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={addParentActive}
                      href={`${path}/email/single/1585118055048`}
                    >
                      Read Email
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </TopMenuStyle>
  );
};

export default TopMenu;
