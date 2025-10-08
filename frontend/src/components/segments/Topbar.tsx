"use client";
import { TopbarProps } from "@/types/ui-props";
import React from "react";
import { FaRegBell } from "react-icons/fa";
import { LuAlignJustify } from "react-icons/lu";
import { Button } from "../ui/button";

export const Topbar: React.FC<TopbarProps> = ({
        scroll,
        sidebarShow,
        setSidebarShow,
        profileDropdownShow,
        setProfileDropdownShow,
        notificationDropdownShow,
        setNotificationDropdownShow,
}) => {
        const topbarClass = scroll > 0
                ? "bg-background mx-4 px-4 w-[calc(100%-2rem)] rounded-b-2xl"
                : "bg-accent px-6 w-full";

        return (
                <div
                        className={`fixed top-0 h-[50px] flex justify-between items-center transition-all overflow-hidden z-0 py-8 ${topbarClass} ${sidebarShow ? "lg:pl-[300px]" : "lg:pl-23"}`}
                >
                        <div className="flex items-center gap-4">
                                <Button
                                        onClick={(e) => {
                                                setSidebarShow(!sidebarShow);
                                                e.stopPropagation();
                                        }}
                                        className={`text-foreground lg:hidden`}
                                >
                                        <LuAlignJustify className="text-2xl" />
                                </Button>

                                
                        </div>

                        <div className="flex items-center gap-1">
                                <Button
                                        size="w-[30px] h-[30px]"
                                        rounded="rounded-full"
                                        color="bg-accent"
                                        className="relative flex justify-center items-center p-2 text-foreground"
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
