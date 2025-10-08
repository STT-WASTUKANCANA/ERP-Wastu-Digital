import { WorkSpaceLayout } from '@/components/layouts/workspace-layout'
import { Card } from '@/components/ui/card'
import React from 'react'
import { LuMailOpen, LuMails } from 'react-icons/lu'

const page = () => {
  return (
    <WorkSpaceLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Card
          title="Surat Keluar"
          value="1.250"
          percent={12.5}
          icon={LuMailOpen}
        />
        <Card
          title="Surat Masuk"
          value="1.250"
          percent={-12.5}
          icon={LuMails}
        />
        <Card
          title="Surat Keluar"
          value="1.250"
          percent={12.5}
          icon={LuMailOpen}
        />
      </div>
    </WorkSpaceLayout>
  )
}

export default page