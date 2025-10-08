import { WorkSpaceLayout } from '@/components/layouts/workspace-layout'
import { Card } from '@/components/ui/card'
import React from 'react'
import { GoReport } from 'react-icons/go'

const page = () => {
  return (
    <WorkSpaceLayout>
      <div className="grid grid-cols-1 gap-2">
        <Card
          title="Total Laporan"
          value="1.250"
          percent={-12.5}
          icon={GoReport}
        />
        <Card
          title="Total Laporan"
          value="1.250"
          percent={12.5}
          icon={GoReport}
        />
      </div>
    </WorkSpaceLayout>
  )
}

export default page