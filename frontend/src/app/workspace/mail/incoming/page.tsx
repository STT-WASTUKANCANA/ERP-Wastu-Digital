"use client"
import { Button } from '@/components/ui/button'
import { Dropdown } from '@/components/ui/dropdown'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { HiOutlineUpload } from 'react-icons/hi'
import { TbDotsVertical } from 'react-icons/tb'

const page = () => {

  const [toolsDropdown, setToolsDropdown] = useState(false)

  return (
    <>
      <div className="lg:flex lg:justify-between lg:items-center">
        <div className="flex justify-center lg:justify-start w-full">
          <div className="text-center lg:text-start space-y-4 lg:space-y-2 w-full lg:max-w-[1200px]">
            <h3 className='font-semibold'>Incoming Mails</h3>
            <span className='text-secondary mb-0'>
              Manage all incoming mails efficiently. Track, archive, and respond to each document to keep your communication workflow organized.
            </span>
          </div>
        </div>

        <div className="flex justify-center mt-4 lg:mt-0">
          <div className='flex gap-2'>
            <Button color='bg-background' size='' className='text-foreground/70 text-sm cursor-pointer px-8 py-2 flex justify-center items-center gap-2 border border-secondary/20'>
              <span><HiOutlineUpload /></span>
              <span>Export</span>
            </Button>
            <Button color='bg-primary' size='' className='text-background text-sm cursor-pointer px-4 py-2'>
              +
            </Button>
          </div>
        </div>
      </div>
      <div className='relative w-full rounded-xl border border-secondary/20'>
        <div className='flex justify-between items-center gap-2 p-3'>
          <Input className='' placeholder='🔍︎  Input the keyword' />
          <Button size='' className='flex justify-center items-center px-3 py-2 border border-secondary/20 gap-2' onClick={() => setToolsDropdown(!toolsDropdown)}>
            <span><TbDotsVertical /></span>
          </Button>
          {(toolsDropdown) && (
            <Dropdown position='right-0 top-15' shadow='shadow-lg'>

            </Dropdown>
          )}
        </div>
        <div className='bg-secondary h-[40px] w-full p-3 flex items-center'>
          <div className='grid grid-cols-1 text-background w-full'>
            <div>Number</div>
          </div>
        </div>
        <div className='h-[40px] w-full p-3 flex items-center'>
          <div className='grid grid-cols-1 text-foreground w-full'>
            <div>SM-00223123/RT/2025</div>
          </div>
        </div>
        <div className='h-[40px] w-full p-3 flex items-center'>
          <div className='grid grid-cols-1 text-foreground w-full'>
            <div>SM-00223123/RT/2025</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default page