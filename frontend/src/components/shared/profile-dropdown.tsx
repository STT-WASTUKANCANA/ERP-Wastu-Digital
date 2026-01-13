"use client";

import React, { useEffect, useState } from "react";
import { BiUser } from "react-icons/bi";
import { BsDoorOpen, BsGear } from "react-icons/bs";
import { Dropdown } from "../ui/dropdown";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { signoutRequest } from "@/lib/api/auth";

export const ProfileDropdown = () => {
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

        return (
                <Dropdown
                        position={`top-18 ${scrollY > 0 ? "right-7" : "right-5"}`}
                        padding="p-0"
                        backgroundColor="bg-background"
                        textColor="text-light"
                        shadow="shadow-lg"
                >
                        <div className="flex flex-col">
                                <Button
                                        size="w-full"
                                        color=""
                                        className="flex items-center gap-3 text-[12px] text-light px-4 py-3 hover:bg-secondary/10 transition-colors"
                                >
                                        <BiUser className="w-[14px] h-[14px]" />
                                        <span className="tracking-[0.5px]">View Profile</span>
                                </Button>

                                <Button
                                        size="w-full"
                                        color=""
                                        className="flex items-center gap-3 text-[12px] text-light px-4 py-3 hover:bg-secondary/10 transition-colors"
                                >
                                        <BsGear className="w-[14px] h-[14px]" />
                                        <span className="tracking-[0.5px]">Settings</span>
                                </Button>

                                <Button
                                        size="w-full"
                                        color=""
                                        rounded=""
                                        onClick={handleSignOut}
                                        className="flex items-center gap-3 text-[12px] text-light px-4 py-3 border-t border-secondary/20 hover:bg-red-500/10 transition-colors"
                                >
                                        <BsDoorOpen className="w-[14px] h-[14px]" />
                                        <span className="tracking-[0.5px]">Sign Out</span>
                                </Button>
                        </div>
                </Dropdown>
        );
};
