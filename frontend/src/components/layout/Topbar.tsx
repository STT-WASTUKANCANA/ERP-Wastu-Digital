import { TopbarProps } from "@/types/shared/ui";
import React from "react";
import { FaRegBell, FaChevronDown } from "react-icons/fa";
import { LuAlignJustify } from "react-icons/lu";
import { Button } from "../ui/button";
import { Breadcumbs } from "../ui/breadcumbs";

export const Topbar: React.FC<TopbarProps> = ({
        scroll,
        sidebarShow,
        setSidebarShow,
        profileDropdownShow,
        setProfileDropdownShow,
        notificationDropdownShow,
        setNotificationDropdownShow,
        user
}) => {
        const topbarClass = scroll > 0 ? "bg-background rounded-b-2xl mx-4 w-[calc(100%-2rem)] lg:w-[calc(100%-280px)] lg:mx-0 lg:rounded-none shadow-sm" : "bg-accent w-full lg:w-[calc(100%-280px)]";

        const desktopPositionClass = sidebarShow ? "lg:left-[280px]" : "lg:left-[64px]";
        const desktopWidthClass = sidebarShow ? "lg:w-[calc(100%-280px)]" : "lg:w-[calc(100%-64px)]";

        return (
                <div
                        className={`
                                fixed top-0 h-[50px] flex justify-between items-center 
                                overflow-hidden z-40 py-8 px-6 lg:px-14 transition-all duration-300
                                ${scroll > 0 ? "bg-background rounded-b-2xl mx-4 w-[calc(100%-2rem)] lg:mx-0 lg:rounded-none shadow-sm" : "bg-accent w-full"}
                                ${desktopPositionClass}
                                ${desktopWidthClass}
                        `}
                >
                        <div className="flex items-center gap-4">
                                <Button
                                        onClick={(e) => {
                                                setSidebarShow(!sidebarShow);
                                                e.stopPropagation();
                                        }}
                                        className="text-foreground lg:hidden cursor-pointer"
                                >
                                        <LuAlignJustify className="text-2xl" />
                                </Button>
                                <Breadcumbs />
                        </div>

                        <div className="flex items-center gap-4">
                                {/* <Button
                                        size="w-[35px] h-[35px]"
                                        rounded="rounded-full"
                                        color="bg-accent"
                                        className="relative flex justify-center items-center p-2 text-foreground cursor-pointer"
                                        onClick={() => {
                                                setNotificationDropdownShow(!notificationDropdownShow);
                                                setProfileDropdownShow(false);
                                        }}
                                >
                                        <span className="absolute -top-1 -left-1 bg-warning w-[15px] h-[15px] rounded-full flex justify-center items-center text-white text-[9px]">
                                                5
                                        </span>
                                        <FaRegBell className="w-full h-full text-foreground" />
                                </Button> */}

                                {user && (
                                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
                                                setProfileDropdownShow(!profileDropdownShow);
                                                setNotificationDropdownShow(false);
                                        }}>
                                                <div className="relative w-[35px] h-[35px] rounded-full overflow-hidden border border-secondary/20 bg-primary flex items-center justify-center text-white font-bold text-xs min-w-[35px]">
                                                        {user.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                                                </div>
                                                <div className="text-left hidden sm:flex flex-col justify-center gap-1">
                                                        <span className="text-xs font-bold text-primary capitalize leading-none">
                                                                {(() => {
                                                                        const roleMap: Record<number, string> = {
                                                                                1: "Tata Laksana",
                                                                                2: "Sekum",
                                                                                3: "Pulahta",
                                                                                4: "Pegawai",
                                                                                5: "Admin"
                                                                        };
                                                                        return roleMap[user.role_id] || "User";
                                                                })()}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                                <span className="text-sm font-[550] text-foreground leading-none">{user.name}</span>
                                                                <FaChevronDown className="text-[10px] text-foreground/70" />
                                                        </div>
                                                </div>
                                        </div>
                                )}
                                {!user && (
                                        <div
                                                className="bg-primary w-[30px] h-[30px] rounded-full cursor-pointer"
                                                onClick={() => {
                                                        setProfileDropdownShow(!profileDropdownShow);
                                                        setNotificationDropdownShow(false);
                                                }}
                                        />
                                )}
                        </div>
                </div>
        );
};