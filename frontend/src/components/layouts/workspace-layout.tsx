"use client";
import React, { useEffect, useState } from "react";
import { NotificationDropdown } from "../segments/NotificationDropdown";
import { ProfileDropdown } from "../segments/ProfileDropdown";
import { useScrollY } from "@/hooks/utils/useScrollY";
import { Topbar } from "../segments/Topbar";
import { Sidebar } from "../segments/Sidebar";

type WorkspaceLayoutProps = {
        children?: React.ReactNode;
};

export const WorkSpaceLayout = ({ children }: WorkspaceLayoutProps) => {
        const [sidebarShow, setSidebarShow] = useState(() => {
                if (typeof window !== "undefined") {
                        const saved = localStorage.getItem("sidebarShow");
                        return saved === "true";
                }
                return false;
        });

        const [isPinned, setIsPinned] = useState(() => {
                if (typeof window !== "undefined") {
                        const saved = localStorage.getItem("sidebarPinned");
                        return saved === "true";
                }
                return false;
        });

        const scrollY = useScrollY();
        const [profileDropdownShow, setProfileDropdownShow] = useState(false);
        const [notificationDropdownShow, setNotificationDropdownShow] = useState(false);

        useEffect(() => {
                localStorage.setItem("sidebarShow", sidebarShow.toString());
        }, [sidebarShow]);

        useEffect(() => {
                localStorage.setItem("sidebarPinned", isPinned.toString());
        }, [isPinned]);

        return (
                <div className="relative">
                        <div
                                className={`flex flex-col relative`}
                                onClick={() => {
                                        if (window.innerWidth < 1024) {
                                                setSidebarShow(false);
                                        }
                                }}
                        >
                                {sidebarShow && (
                                        <div className="absolute inset-0 bg-black/40 z-10 lg:hidden"></div>
                                )}
                                <Topbar
                                        scroll={scrollY}
                                        sidebarShow={sidebarShow}
                                        setSidebarShow={setSidebarShow}
                                        profileDropdownShow={profileDropdownShow}
                                        setProfileDropdownShow={setProfileDropdownShow}
                                        notificationDropdownShow={notificationDropdownShow}
                                        setNotificationDropdownShow={setNotificationDropdownShow}
                                />
                                {profileDropdownShow && <ProfileDropdown />}
                                {notificationDropdownShow && (
                                        <NotificationDropdown
                                                notificationDropdownShow={notificationDropdownShow}
                                                setNotificationDropdownShow={setNotificationDropdownShow}
                                        />
                                )}
                                <main
                                        className={`
                        p-4 bg-accent min-h-screen transition-all duration-300
                        ${sidebarShow ? "lg:ml-[280px]" : "lg:ml-16"}
                    `}
                                        onClick={() => {
                                                setProfileDropdownShow(false);
                                                setNotificationDropdownShow(false);
                                        }}
                                >
                                        <div className="mt-[60px] space-y-6">{children}</div>
                                </main>
                        </div>
                        <Sidebar
                                sidebarShow={sidebarShow}
                                setSidebarShow={setSidebarShow}
                                isPinned={isPinned}
                                setIsPinned={setIsPinned}
                        />
                </div>
        );
};