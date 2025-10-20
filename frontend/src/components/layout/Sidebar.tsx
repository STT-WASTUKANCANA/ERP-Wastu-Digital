"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import { Button } from "../ui/button";
import { LuAlignJustify } from "react-icons/lu";
import { navLinks } from "@/constants/navlink";

export interface SidebarProps {
  sidebarShow: boolean;
  setSidebarShow: (value: boolean) => void;
  isPinned: boolean;
  setIsPinned: (value: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarShow,
  setSidebarShow,
  isPinned,
  setIsPinned,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleToggleClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarShow(!sidebarShow);
    } else {
      const newPinnedState = !isPinned;
      setIsPinned(newPinnedState);
      if (newPinnedState) {
        setSidebarShow(true);
      }
    }
  };

  return (
    <div
      className={`
                fixed top-0 left-0 h-screen bg-background z-50 space-y-8
                transform transition-all duration-300
                ${sidebarShow ? "w-[280px] p-5 translate-x-0" : "w-16 lg:w-16 lg:p-3 -translate-x-full lg:translate-x-0"}
            `}
      onMouseEnter={() => {
        if (!isPinned && window.innerWidth >= 1024) {
          setSidebarShow(true);
        }
      }}
      onMouseLeave={() => {
        if (!isPinned && window.innerWidth >= 1024) {
          setSidebarShow(false);
        }
      }}
    >
      <div className={`flex justify-between items-center`}>
        <div className={`w-10 h-10 bg-foreground rounded-full transition-all duration-300 ${!sidebarShow ? "mx-auto" : ""}`}></div>
        <Button
          color=""
          size="w-[28px] h-[28px]"
          rounded="rounded-full"
          className={`text-foreground flex items-center justify-center cursor-pointer ${!sidebarShow ? "lg:hidden" : ""}`}
          onClick={handleToggleClick}
        >
          <LuAlignJustify className={`w-4 h-4 transition-transform duration-300 ${!sidebarShow ? "rotate-180" : ""}`} />
        </Button>
      </div>

      <div className="space-y-4">
        {navLinks.map((section, idx) => (
          <div key={idx} className="space-y-2">
            {sidebarShow && (
              <span className="block text-secondary text-xs uppercase tracking-wide sm">
                {section.title}
              </span>
            )}
            {!sidebarShow && idx !== 0 && (
              <hr className="border-t border-secondary my-2" />
            )}

            {section.links.map((link, linkIdx) => {
              const Icon = link.icon;
              if (link.children) {
                const isOpen = openDropdown === link.name;
                const hasActiveChild = link.children?.some(
                  (child) => pathname.startsWith(child.href)
                ) || false;


                return (
                  <div key={linkIdx}>
                    <button
                      onClick={() => toggleDropdown(link.name)}
                      className={`w-full h-11 px-3 rounded-md flex items-center justify-between text-sm font-medium transition cursor-pointer ${hasActiveChild
                        ? "text-primary bg-primary/20"
                        : "text-foreground/70 hover:text-primary hover:bg-primary/10"
                        }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        {sidebarShow && link.name}
                      </span>
                      {sidebarShow &&
                        (isOpen ? <IoChevronDown className="w-4 h-4" /> : <IoChevronForward className="w-4 h-4" />)}
                    </button>

                    {isOpen && sidebarShow && (
                      <div className="ml-7 space-y-1">
                        {link.children.map((child, cIdx) => (
                          <Link
                            key={cIdx}
                            href={child.href}
                            className={`relative flex items-center gap-2 h-10 p-3 rounded-md text-sm transition ${pathname === child.href
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
                  className={`h-11 px-3 rounded-md flex items-center gap-3 text-sm font-medium transition ${
                    pathname.startsWith(link.href)
                    ? "text-primary bg-primary/20"
                    : "text-foreground/60 hover:text-primary hover:bg-primary/10"
                    }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {sidebarShow && link.name}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};