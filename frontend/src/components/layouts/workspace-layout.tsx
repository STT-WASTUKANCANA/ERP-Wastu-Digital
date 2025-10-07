"use client";
import React, { useState } from "react";
import { NotificationDropdown } from "../segments/NotificationDropdown";
import { ProfileDropdown } from "../segments/ProfileDropdown";
import { useScrollY } from "@/hooks/utils/useScrollY";
import { Topbar } from "../segments/Topbar";
import { Sidebar } from "../segments/Sidebar";

type WorkspaceLayoutProps = {
        children?: React.ReactNode;
};

export const WorkSpaceLayout = ({ children }: WorkspaceLayoutProps) => {
        const [sidebarShow, setSidebarShow] = useState(false);
        const scrollY = useScrollY();
        const [profileDropdownShow, setProfileDropdownShow] = useState(false);
        const [notificationDropdownShow, setNotificationDropdownShow] = useState(false);

        return (
                <div className="relative grid lg:grid-cols-[70px_1fr] min-h-[200vh]">
                        <div className={`flex flex-col relative`} onClick={() => {
                                if (sidebarShow) {
                                        setSidebarShow(false);
                                }
                        }}>
                                {sidebarShow && (
                                        <div className="absolute inset-0 bg-black/40 z-10"></div>
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
                                {(profileDropdownShow) && (
                                        <ProfileDropdown />
                                )}
                                {(notificationDropdownShow) && (
                                        <NotificationDropdown
                                                notificationDropdownShow={notificationDropdownShow}
                                                setNotificationDropdownShow={setNotificationDropdownShow}
                                        />
                                )}
                                <main
                                        className={`p-4 flex-1 bg-accent`}
                                        onClick={() => {
                                                setSidebarShow(false);
                                                setProfileDropdownShow(false);
                                                setNotificationDropdownShow(false);
                                        }}
                                >
                                        <div className="mt-[60px] space-y-6">
                                                {children}
                                        </div>
                                </main>


                        </div>
                        <Sidebar
                                sidebarShow={sidebarShow}
                                setSidebarShow={setSidebarShow}
                        />
                </div>
        )
}
