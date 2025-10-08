"use client";
import { TopbarProps } from "@/types/ui-props";
import React, { useState, useEffect } from "react";
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
        const [isMobile, setIsMobile] = useState(false);

        useEffect(() => {
                const handleResize = () => setIsMobile(window.innerWidth < 1024);
                handleResize();
                window.addEventListener("resize", handleResize);
                return () => window.removeEventListener("resize", handleResize);
        }, []);

        const paddingLeft = !isMobile ? (sidebarShow ? 300 : 90) : 16;
        const topbarClass = scroll > 0
                ? "bg-background rounded-b-2xl"
                : "bg-accent";

        return (
                <div
                        className={`fixed top-0 h-[50px] w-full flex justify-between items-center transition-all overflow-hidden z-0 py-8 ${topbarClass}`}
                        style={{
                                paddingLeft: paddingLeft,
                                paddingRight: 32,
                                transition: "padding 0.3s ease, background-color 0.3s ease",
                        }}
                >
                        <div className="flex items-center gap-4">
                                <Button
                                        onClick={(e) => {
                                                setSidebarShow(!sidebarShow);
                                                e.stopPropagation();
                                        }}
                                        className="text-foreground lg:hidden"
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
