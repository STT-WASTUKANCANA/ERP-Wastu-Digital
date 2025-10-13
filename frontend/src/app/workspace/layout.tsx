"use client";

import React, { useEffect, useState } from "react";
import { NotificationDropdown } from "@/components/segments/NotificationDropdown";
import { ProfileDropdown } from "@/components/segments/ProfileDropdown";
import { useScrollY } from "@/hooks/utils/useScrollY";
import { Sidebar } from "@/components/segments/Sidebar";
import { Topbar } from "@/components/segments/Topbar";

export default function Layout({ children }: { children: React.ReactNode }) {
        const [sidebarShow, setSidebarShow] = useState(false);
        const [isPinned, setIsPinned] = useState(false);
        const [isHydrated, setIsHydrated] = useState(false);

        const scrollY = useScrollY();
        const [profileDropdownShow, setProfileDropdownShow] = useState(false);
        const [notificationDropdownShow, setNotificationDropdownShow] = useState(false);

        useEffect(() => {
                const width = window.innerWidth;
                const isDesktop = width >= 1024;

                setSidebarShow(isDesktop);
                setIsPinned(isDesktop);
                setIsHydrated(true);
        }, []);

        if (!isHydrated) {
                return (
                        <div className="min-h-screen bg-accent p-6">
                                <div className="mt-[60px] space-y-6 opacity-0">{children}</div>
                        </div>
                );
        }

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
                                        className={`p-6 bg-accent min-h-screen transition-all duration-300 ${sidebarShow ? "lg:ml-[280px]" : "lg:ml-16"
                                                }`}
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
}
