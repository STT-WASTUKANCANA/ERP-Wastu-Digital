"use client";

import React, { useEffect, useState } from "react";
import { BiUser, BiHistory } from "react-icons/bi";
import { BsDoorOpen } from "react-icons/bs";
import { Dropdown } from "../ui/dropdown";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { signoutRequest } from "@/lib/api/auth";

interface ProfileDropdownProps {
        user?: any;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user }) => {
        const router = useRouter();
        const [scrollY, setScrollY] = useState(0);

        useEffect(() => {
                const handleScroll = () => {
                        setScrollY(window.scrollY);
                };

                window.addEventListener("scroll", handleScroll);
                return () => {
                        window.removeEventListener("scroll", handleScroll);
                };
        }, []);

        const handleSignOut = async () => {
                try {
                        await signoutRequest();
                } catch (error) {
                        console.error("Signout failed", error);
                } finally {
                        sessionStorage.clear();
                        router.push("/auth/signin");
                }
        };

        const getInitials = (name: string) => {
                if (!name) return "U";
                return name.substring(0, 2).toUpperCase();
        };

        return (
                <Dropdown
                        position={`top-18 ${scrollY > 0 ? "right-7" : "right-5"}`}
                        padding="p-0"
                        backgroundColor="bg-background"
                        textColor="text-foreground"
                        shadow="shadow-xl"
                        size="w-[280px]"
                >
                        <div className="flex flex-col">
                                {/* Header Section */}
                                <div className="flex items-center gap-3 p-5">
                                        <div className="w-10 h-10 rounded-full bg-[#8c5cf5] flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                {getInitials(user?.name)}
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                                <span className="font-bold text-sm text-foreground truncate">{user?.name || "User"}</span>
                                                <span className="text-xs text-muted-foreground truncate">{user?.email || "user@example.com"}</span>
                                        </div>
                                </div>

                                <div className="h-[1px] bg-secondary/10 w-full mb-2"></div>

                                {/* Menu Items */}
                                <div className="px-2 pb-2 flex flex-col gap-1">
                                        <Button
                                                size="w-full"
                                                color=""
                                                className="flex items-center gap-3 text-sm text-foreground/70 px-3 py-2.5 rounded-md hover:bg-primary/5 hover:text-primary transition-colors justify-start font-medium"
                                        >
                                                <BiUser className="w-[18px] h-[18px]" />
                                                <span>View Profile</span>
                                        </Button>

                                        <Button
                                                size="w-full"
                                                color=""
                                                className="flex items-center gap-3 text-sm text-foreground/70 px-3 py-2.5 rounded-md hover:bg-primary/5 hover:text-primary transition-colors justify-start font-medium"
                                        >
                                                <BiHistory className="w-[18px] h-[18px]" />
                                                <span>View History</span>
                                        </Button>


                                        <div className="my-1 h-[1px] bg-secondary/10 w-full"></div>

                                        <Button
                                                size="w-full"
                                                color=""
                                                onClick={handleSignOut}
                                                className="flex items-center gap-3 text-sm text-foreground/70 px-3 py-2.5 rounded-md hover:bg-red-50 hover:text-red-500 transition-colors justify-start font-medium"
                                        >
                                                <BsDoorOpen className="w-[18px] h-[18px]" />
                                                <span>Sign Out</span>
                                        </Button>
                                </div>
                        </div>
                </Dropdown>
        );
};
