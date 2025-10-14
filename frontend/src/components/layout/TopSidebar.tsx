import React from 'react'
import { FaFacebook } from 'react-icons/fa'
import { MdOutlineSpaceDashboard } from 'react-icons/md'
import { GoStack } from 'react-icons/go'
import { Button } from '../ui/button'

export const TopSidebar = () => {
  return (
    <div className="flex flex-col space-y-8">
      <Button
        size="w-[30px] h-[30px]"
        rounded="rounded-full"
        className="text-primary flex justify-center items-center mx-auto"
        route='/'
      >
        <FaFacebook  className='w-full h-full'/>
      </Button>

      <Button size="text-light" className="mx-auto">
        <MdOutlineSpaceDashboard className="w-[20px] h-[20px]" />
      </Button>
      <Button size="text-light" className="mx-auto">
        <GoStack className="w-[20px] h-[20px]" />
      </Button>
    </div>
  )
}
