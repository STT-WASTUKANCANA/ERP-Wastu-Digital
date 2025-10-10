"use client";
import React, { useEffect, useState } from "react";
import { NotificationDropdown } from "../segments/NotificationDropdown";
import { ProfileDropdown } from "../segments/ProfileDropdown";
import { useScrollY } from "@/hooks/utils/useScrollY";
import { Sidebar } from "../segments/Sidebar";
import { Topbar } from "../segments/Topbar";

type WorkspaceLayoutProps = {
        children?: React.ReactNode;
};

export const WorkSpaceLayout = ({ children }: WorkspaceLayoutProps) => {
        const [sidebarShow, setSidebarShow] = useState(true);
        const [isPinned, setIsPinned] = useState(false);

        const scrollY = useScrollY();
        const [profileDropdownShow, setProfileDropdownShow] = useState(false);
        const [notificationDropdownShow, setNotificationDropdownShow] = useState(false);

        useEffect(() => {
                const handleInitialSidebar = () => {
                        const width = window.innerWidth;
                        if (width >= 1024) {
                                setSidebarShow(true);
                                setIsPinned(true);
                        } else {
                                setSidebarShow(false);
                                setIsPinned(false);
                        }
                };

                handleInitialSidebar();
        }, []);

        useEffect(() => {
                localStorage.setItem("sidebarShow", sidebarShow.toString());
        }, [sidebarShow]);

        useEffect(() => {
                localStorage.setItem("sidebarPinned", isPinned.toString());
        }, [isPinned]);

        return (
                <div className="relative">
                        <div
                                className="flex flex-col relative"
                                onClick={() => {
                                        if (window.innerWidth < 1024) setSidebarShow(false);
                                }}
                        >
                                {sidebarShow && <div className="absolute inset-0 bg-black/40 z-30 lg:hidden"></div>}
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
                                                p-6 bg-accent min-h-screen transition-all duration-300
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
