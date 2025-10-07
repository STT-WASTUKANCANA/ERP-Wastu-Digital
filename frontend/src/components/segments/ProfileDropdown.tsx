import React from 'react'
import { BiUser } from 'react-icons/bi'
import { BsDoorOpen, BsGear } from 'react-icons/bs'
import { Dropdown } from '../ui/dropdown'
import { Button } from '../ui/button'

export const ProfileDropdown = () => {
        return (
                <Dropdown position={`top-18 ${scrollY > 0 ? 'right-7' : 'right-5'} `} padding="p-0" backgroundColor="bg-background" textColor="text-light" shadow="shadow-lg">
                        <Button size="w-full" color="" className="flex items-center gap-4 text-[14px] text-light px-4 py-4">
                                <BiUser className="w-[14px] h-[14px]" />
                                <span className="tracking-[1px]">View Profile</span>
                        </Button>
                        <Button size="w-full" color="" className="flex items-center gap-4 text-[14px] text-light px-4 pb-4">
                                <BsGear className="w-[14px] h-[14px]" />
                                <span className="tracking-[1px]">Settings</span>
                        </Button>
                        <hr className="border-t-1 border-secondary" />
                        <Button size="w-full" color="" className="flex items-center gap-4 text-[14px] text-light p-4">
                                <BsDoorOpen className="w-[14px] h-[14px]" />
                                <span className="tracking-[1px]">Sign Out</span>
                        </Button>
                </Dropdown>
        )
}
