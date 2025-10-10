import { WorkSpaceLayout } from "@/components/layouts/workspace-layout";
import { Card } from "@/components/ui/card";
import { getIncomingMailSummary } from "@/lib/api/mails/incoming";
import React from "react";
import { BsInbox, BsSend } from "react-icons/bs";
import { LuUsers } from "react-icons/lu";

const Page = async () => {
  const response = await getIncomingMailSummary();

  if (!response.ok) {
    return (
      <WorkSpaceLayout>
        <p className="text-red-500">Gagal memuat atau format data ringkasan tidak valid.</p>
      </WorkSpaceLayout>
    );
  }

  const incomingMailData = response.data.data;

  const incomingMailValue = incomingMailData.current_month_total;

  let incomingMailPercent = incomingMailData.percentage_change;
  if (incomingMailData.status !== 'increase') {
    incomingMailPercent = -incomingMailPercent;
  }

  const outgoingMailValue = "...";
  const usersValue = "..."; 

  return (
    <WorkSpaceLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Card
          title="Incoming Mail"
          value={incomingMailValue.toString()}
          percent={incomingMailPercent}
          icon={BsInbox}
        />
        <Card
          title="Outgoing Mail"
          value={122}
          percent={0}
          icon={BsSend}
        />
        <Card
          title="Users"
          value={0}
          icon={LuUsers}
        />
      </div>
    </WorkSpaceLayout>
  );
};

export default Page;