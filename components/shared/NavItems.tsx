"use client";

import { headerLinks, isAdmin } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavItems = async () => {
  const pathname = usePathname();
  const userIsAdmin = await isAdmin();
  return (
    <ul className="md:flex-between flex w-full flex-col items-start gap-5 md:flex-row">
      {headerLinks.map((link) => {
        const isActive = pathname === link.route;

        return (
          <React.Fragment key={link.route}>
            <li
              className={`${
                isActive && "text-primary-500"
              } flex-center p-medium-16 whitespace-nowrap`}
            >
              <Link href={link.route}>{link.label}</Link>
            </li>
          </React.Fragment>
        );
      })}
    </ul>
  );
};

export default NavItems;
