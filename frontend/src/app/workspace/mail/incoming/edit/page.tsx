"use client";

import { useEffect, useState } from "react";
import { FiCornerDownLeft } from "react-icons/fi";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import IncomingForm from "@/components/features/mails/incomingMail/incoming-form";
import { useMailPageData } from "@/hooks/features/mail/useMailPageData";

export default function Page() {
  const { categories, mail, roleId, isLoading, divisions } = useMailPageData({
    mailIdSessionKey: "editingMailId",
    fetchRole: true,
    fetchDivisions: true
  });

  if (isLoading) {
    return <div>Loading mail data...</div>;
  }
  return (
    <div className="space-y-8 lg:px-24 xl:px-56">
      <PageHeader
        title="Edit Incoming Mail"
        description="Modify the details of an existing incoming mail record."
      >
        <Button
          color="bg-background"
          className="flex text-sm justify-center items-center gap-2 text-foreground border border-secondary/20 px-8 py-2 cursor-pointer"
          route="back"
        >
          <FiCornerDownLeft />
          Back
        </Button>
      </PageHeader>

      {mail && roleId !== null && (
        <IncomingForm
          categories={categories}
          initialData={mail}
          mode="edit"
          roleId={roleId}
          divisions={divisions}
        />
      )}
    </div>
  );
}
