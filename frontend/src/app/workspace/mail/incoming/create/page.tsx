import React from 'react'
import { Button } from '@/components/ui/button'
import { FiCornerDownLeft } from 'react-icons/fi'
import { PageHeader } from '@/components/shared/page-header'
import IncomingCreate from '@/components/features/mails/incomingMail/create'
import { getMailCategories } from '@/lib/api/mails/incoming'

export default async function Page () {
        const res = await getMailCategories()
        const categories = res.data?.data
        return (
                <div className='space-y-8 lg:px-24 xl:px-56'>
                        <PageHeader
                                title="Create Incoming Mail"
                                description="Complete the form to add a new incoming mail record."
                        >
                                <Button color="bg-background" className='flex text-sm justify-center items-center gap-2 text-foreground border border-secondary/20 px-8 py-2 cursor-pointer' route='back'>
                                        <FiCornerDownLeft />
                                        Back
                                </Button>
                        </PageHeader>

                        <IncomingCreate categories={categories}/>
                </div>
        )
}
