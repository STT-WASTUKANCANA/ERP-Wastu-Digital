import { TopbarProps } from "@/types/ui-props";
import React from "react";
import { FaRegBell } from "react-icons/fa";
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
}) => {
        const topbarClass = scroll > 0 ? "bg-background rounded-b-2xl mx-4 w-[calc(100%-2rem)] lg:w-full lg:mx-0 lg:rounded-none" : "bg-accent w-full";

        const desktopPaddingClass = sidebarShow ? "lg:pl-[300px]" : "lg:pl-[90px]";

        return (
                <div
                        className={`
                                fixed top-0 h-[50px] flex justify-between items-center 
                                overflow-hidden z-0 py-8 px-4 transition-all duration-300
                                ${topbarClass}
                                ${desktopPaddingClass}
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

                        <div className="flex items-center gap-1">
                                <Button
                                        size="w-[30px] h-[30px]"
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
                                </Button>

                                <div
                                        className="bg-primary w-[30px] h-[30px] rounded-full cursor-pointer"
                                        onClick={() => {
                                                setProfileDropdownShow(!profileDropdownShow);
                                                setNotificationDropdownShow(false);
                                        }}
                                />
                        </div>
                </div>
        );
};