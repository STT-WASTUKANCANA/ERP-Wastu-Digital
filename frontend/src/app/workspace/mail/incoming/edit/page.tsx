"use client";

import { useEffect, useState } from "react";
import { FiCornerDownLeft } from "react-icons/fi";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import IncomingForm from "@/components/features/mails/incoming-mail/incoming-form";
import { useMailPageData } from "@/hooks/features/mail/use-mail-page-data";

export default function Page() {
  const { categories, mail, isLoading, divisions } = useMailPageData({
    mailIdSessionKey: "editingMailId",
    mailType: "incoming",
    fetchDivisions: true
  });

  if (isLoading) {
    return <div>Loading mail data...</div>;
  }
  return (
    <div className="space-y-8 lg:px-24 xl:px-56">
      <PageHeader
        title="Edit Surat Masuk"
        description="Ubah detail dari surat masuk yang sudah ada."
      >
        <Button
          color="bg-background"
          className="flex text-sm justify-center items-center gap-2 text-foreground border border-secondary/20 px-8 py-2 cursor-pointer"
          route="back"
        >
          <FiCornerDownLeft />
          Kembali
        </Button>
      </PageHeader>

      {mail && (
        <IncomingForm
          categories={categories}
          initialData={mail}
          mode="edit"
          divisions={divisions}
        />
      )}
    </div>
  );
}
