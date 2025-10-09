import { WorkSpaceLayout } from '@/components/layouts/workspace-layout'
import { Card } from '@/components/ui/card'
import React from 'react'
import { BsInbox, BsSend } from 'react-icons/bs'
import { LuUsers } from 'react-icons/lu'

const page = () => {
  return (
    <WorkSpaceLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Card
          title="Incoming Mail"
          value="1.250"
          percent={-12.5}
          icon={BsInbox}
        />
        <Card
          title="Outgoing Mail"
          value="1.250"
          percent={12.5}
          icon={BsSend}
        />
        <Card
          title="Users"
          value="20"
          icon={LuUsers}
        />
      </div>
    </WorkSpaceLayout>
  )
}

export default page