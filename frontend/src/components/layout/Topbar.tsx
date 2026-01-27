import { TopbarProps } from "@/types/shared/ui";
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
        user
}) => {
        const topbarClass = scroll > 0 ? "bg-background rounded-b-2xl mx-4 w-[calc(100%-2rem)] lg:w-full lg:mx-0 lg:rounded-none shadow-sm" : "bg-accent w-full";

        const desktopPaddingClass = sidebarShow ? "lg:pl-[300px]" : "lg:pl-[90px]";

        return (
                <div
                        className={`
                                fixed top-0 h-[50px] flex justify-between items-center 
                                overflow-hidden z-40 py-8 px-4 transition-all duration-300
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

                                {user && (
                                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => {
                                        setProfileDropdownShow(!profileDropdownShow);
                                        setNotificationDropdownShow(false);
                                    }}>
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-semibold text-foreground">{user.name}</p>
                                            <p className="text-xs text-foreground/60 font-medium capitalize">
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
                                            </p>
                                        </div>
                                        <div className="relative w-[35px] h-[35px] rounded-full overflow-hidden border border-secondary/20">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
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