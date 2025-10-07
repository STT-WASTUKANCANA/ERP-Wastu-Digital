"use client";
import React, { useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsArrowLeft, BsGrid1X2 } from "react-icons/bs";
import { FaRegFileLines } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { IoStatsChartOutline, IoChevronDown, IoChevronForward } from "react-icons/io5";
import { GrTable } from "react-icons/gr";
import { SidebarProps } from "@/types/ui-props";
import { Button } from "../ui/button";

// Definisi menu
const navLinks = [
  {
    title: "Dashboard",
    links: [
      {
        name: "Overview",
        href: '/workspace/overview',
        icon: BsGrid1X2,
      },
    ],
  },
  {
    title: "Contoh",
    links: [
      {
        name: "Reports",
        icon: IoStatsChartOutline,
        children: [
          { name: "Monthly", href: "/users" },
          { name: "Weekly", href: "/users/add" },
        ],
      },
      {
        name: "Table",
        href: "/workspace/table",
        icon: GrTable,
      },
    ],
  },
  {
    title: "Management",
    links: [
      {
        name: "Users",
        href: "/users",
        icon: FaUsers,
      },
      {
        name: "Documents",
        href: "/documents",
        icon: FaRegFileLines,
      },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarShow,
  setSidebarShow,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-[280px] h-screen p-5 bg-background z-50 space-y-8
    transform transition-transform duration-300
    ${sidebarShow ? "translate-x-0" : "-translate-x-full"}
  `}
    >

      <div className="flex justify-between items-center">
        <div className="w-10 h-10 bg-foreground rounded-full"></div>
        <Button
          color=""
          size="w-[28px] h-[28px]"
          rounded="rounded-full"
          className="text-foreground flex items-center justify-center"
          onClick={() => setSidebarShow(!sidebarShow)}
        >
          <BsArrowLeft className="w-4 h-4" />
        </Button>

      </div>

      <div className="space-y-4">
        {navLinks.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <span className="block text-secondary text-xs uppercase tracking-wide">
              {section.title}
            </span>

            {section.links.map((link, linkIdx) => {
              const Icon = link.icon;

              if (link.children) {
                const isOpen = openDropdown === link.name;
                const hasActiveChild = link.children.some(
                  (child) => child.href === pathname
                );

                return (
                  <div key={linkIdx}>
                    <button
                      onClick={() => toggleDropdown(link.name)}
                      className={`w-full h-11 px-3 rounded-md flex items-center justify-between text-sm font-medium transition
                        ${hasActiveChild
                          ? "text-primary bg-primary/20"
                          : "text-foreground/70 hover:text-primary hover:bg-primary/10"
                        }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        {link.name}
                      </span>
                      {isOpen ? (
                        <IoChevronDown className="w-4 h-4" />
                      ) : (
                        <IoChevronForward className="w-4 h-4" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="ml-7 space-y-1">
                        {link.children.map((child, cIdx) => (
                          <Link
                            key={cIdx}
                            href={child.href}
                            className={`relative flex items-center gap-2 h-10 p-3 rounded-md text-sm transition
                              ${pathname === child.href
                                ? "text-foreground bg-primary/20"
                                : "text-foreground/60 hover:text-foreground hover:bg-primary/10"
                              }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-foreground/50"></span>
                            <span className="ml-2">{child.name}</span>
                          </Link>
                        ))}

                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={linkIdx}
                  href={link.href || "#"}
                  className={`h-11 px-3 rounded-md flex items-center gap-3 text-sm font-medium transition
                    ${pathname === link.href
                      ? "text-primary bg-primary/20"
                      : "text-foreground/60 hover:text-primary hover:bg-primary/10"
                    }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {link.name}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
