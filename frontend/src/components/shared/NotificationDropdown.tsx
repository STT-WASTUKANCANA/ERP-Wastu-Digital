"use client";
import React, { useState } from "react";
import { NotificationDropdownProps } from "@/types/ui-props";
import { Button } from "../ui/button";
import { Dropdown } from "../ui/dropdown";
import { CgClose } from "react-icons/cg";

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
        notificationDropdownShow,
        setNotificationDropdownShow,
}) => {
        const [activeTab, setActiveTab] = useState<"all" | "archive">("all");

        const scrollOffset =
                typeof window !== "undefined" && window.scrollY > 0 ? "right-7" : "right-5";
        const dropdownWidth =
                typeof window !== "undefined" && window.scrollY > 0
                        ? "w-[375px]"
                        : "w-[390px]";

        return (
                <Dropdown
                        position={`top-18 ${scrollOffset}`}
                        padding="p-4"
                        backgroundColor="bg-background"
                        textColor="text-light"
                        shadow="shadow-lg"
                        size={dropdownWidth}
                >
                        <div className="space-y-4 z-20">
                                <div className="flex justify-between items-center">
                                        <h4 className="tracking-[1px] font-semibold">Notification</h4>
                                        <Button
                                                color=""
                                                size="w-[20px] h-[20px]"
                                                className="flex justify-center items-center text-foreground p-0"
                                                onClick={() => setNotificationDropdownShow(!notificationDropdownShow)}
                                        >
                                                <CgClose className="w-full h-full" />
                                        </Button>
                                </div>

                                <div className="flex gap-4 text-[12px]">
                                        {[
                                                { key: "all", label: "All", count: 8 },
                                                { key: "archive", label: "Archive", count: 12 },
                                        ].map((tab) => (
                                                <div
                                                        key={tab.key}
                                                        onClick={() =>
                                                                setActiveTab(tab.key as "all" | "archive")
                                                        }
                                                        className={`flex gap-2 ps-1 pe-4 pb-2 cursor-pointer transition-colors ${activeTab === tab.key
                                                                        ? "border-b-2 border-primary text-foreground"
                                                                        : "text-secondary hover:text-foreground"
                                                                }`}
                                                >
                                                        <span className="text-sm">{tab.label}</span>
                                                        <div className="bg-primary text-background flex justify-center items-center rounded-full w-6 h-6 text-xs">
                                                                {tab.count}
                                                        </div>
                                                </div>
                                        ))}
                                </div>

                                <div className="min-h-[300px] space-y-4">
                                        <div className="flex justify-between items-center">
                                                <div className="flex gap-4 cursor-pointer">
                                                        <div className="relative w-[45px] h-[45px] rounded-full bg-light">
                                                                <div className="absolute right-0 bottom-0 w-[40px] h-[40px] rounded-full bg-primary"></div>
                                                        </div>
                                                        <div className="space-y-1">
                                                                <div className="text-md">
                                                                        Eve Monroe
                                                                        <span className="text-secondary"> assigned a task to you </span>
                                                                </div>
                                                                <div className="text-sm text-secondary">
                                                                        12 September 2025 ◦ 8:45 PM
                                                                </div>
                                                        </div>
                                                </div>
                                                <div className="w-[15px] h-[15px] rounded-full bg-danger"></div>
                                        </div>
                                </div>
                        </div>
                </Dropdown>
        );
};
