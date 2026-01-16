import { Card } from "@/components/ui/card";
import { getIncomingMailSummary } from "@/lib/api/mails/incoming";
import { getOutgoingMailSummary } from "@/lib/api/mails/outgoing";
import { getDecisionMailSummary } from "@/lib/api/mails/decision";
import React from "react";
import { BsInbox, BsSend, BsFileText } from "react-icons/bs";
import { LuUsers } from "react-icons/lu";

const Page = async () => {
  const incomingResponse = await getIncomingMailSummary();
  const outgoingResponse = await getOutgoingMailSummary();
  const decisionResponse = await getDecisionMailSummary();

  if (!incomingResponse.ok || !incomingResponse.data?.data) {
    return <p className="text-red-500">Gagal memuat data incoming mail.</p>;
  }
  if (!outgoingResponse.ok || !outgoingResponse.data?.data) {
    return <p className="text-red-500">Gagal memuat data outgoing mail.</p>;
  }
  if (!decisionResponse.ok || !decisionResponse.data?.data) {
    return <p className="text-red-500">Gagal memuat data decision mail.</p>;
  }

  // Incoming mail
  const incomingMailData = incomingResponse.data.data;
  const incomingMailValue = incomingMailData.current_month_total;
  let incomingMailPercent = incomingMailData.percentage_change;
  if (incomingMailData.status !== "increase") {
    incomingMailPercent = -incomingMailPercent;
  }

  // Outgoing mail
  const outgoingMailData = outgoingResponse.data.data;
  const outgoingMailValue = outgoingMailData.current_month_total;
  let outgoingMailPercent = outgoingMailData.percentage_change;
  if (outgoingMailData.status !== "increase") {
    outgoingMailPercent = -outgoingMailPercent;
  }

  // Decision mail
  const decisionMailData = decisionResponse.data.data;
  const decisionMailValue = decisionMailData.current_month_total;
  let decisionMailPercent = decisionMailData.percentage_change;
  if (decisionMailData.status !== "increase") {
    decisionMailPercent = -decisionMailPercent;
  }

  // Users
  const usersValue = 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {/* <Card title="Pengguna" value={usersValue} icon={LuUsers} /> */}
      <Card
        title="Surat Masuk"
        value={incomingMailValue.toString()}
        percent={incomingMailPercent}
        icon={BsInbox}
      />
      <Card
        title="Surat Keluar"
        value={outgoingMailValue.toString()}
        percent={outgoingMailPercent}
        icon={BsSend}
      />
      <Card
        title="Surat Keputusan"
        value={decisionMailValue.toString()}
        percent={decisionMailPercent}
        icon={BsFileText}
      />
    </div>
  );
};


export default Page;
