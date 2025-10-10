import { WorkSpaceLayout } from '@/components/layouts/workspace-layout'
import { Button } from '@/components/ui/button'
import React from 'react'
import { BiPrinter } from 'react-icons/bi'

const page = () => {
  return (
    <WorkSpaceLayout>
      <div className="lg:flex lg:justify-between lg:items-start">
        <div className="flex justify-center lg:justify-start w-full">
          <div className="text-center lg:text-start space-y-4 lg:space-y-2 w-full lg:w-[90%] max-w-[900px]">
            <h2 className='font-semibold tracking-[2px]'>Table</h2>
            <p className='text-secondary mb-0'>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos quas doloremque minima praesentium ipsam! 
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-4 lg:mt-0">
          <div className='w-[300px] flex gap-2'>
            <Button color='bg-secondary' size='w-[150px] h-[40px]' className='text-background cursor-pointer flex justify-center items-center gap-2'>
              <span><BiPrinter /></span>
              <span>Print</span>
            </Button>
            <Button color='bg-primary' size='w-[150px] h-[40px]' className='text-background cursor-pointer'>
              + Income Mails
            </Button>
          </div>
        </div>
      </div>
    </WorkSpaceLayout>
  )
}

export default page