"use client";

import IncomingForm from "@/components/features/mails/incomingMail/incoming-form";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useMailPageData } from "@/hooks/features/mail/useMailPageData";
import { FiCornerDownLeft } from "react-icons/fi";

export default function Page() {

  const { categories, divisions, mail, isLoading } = useMailPageData({
    mailIdSessionKey: "reviewMailId",
    fetchDivisions: true,
  });

  if (isLoading) {
    return <div>Loading mail data...</div>;
  }

  return (
    <div className="space-y-8 lg:px-24 xl:px-56">
      <PageHeader
        title="Review Incoming Mail"
        description="Review and modify the details of an existing incoming mail record."
      >
        <Button
          color="bg-background"
          className="flex items-center justify-center gap-2 px-8 py-2 text-sm text-foreground border border-secondary/20 cursor-pointer"
          route="back"
        >
          <FiCornerDownLeft />
          Back
        </Button>
      </PageHeader>

      {mail && (
        <IncomingForm
          categories={categories}
          initialData={mail}
          divisions={divisions}
          mode="review"
        />
      )}
    </div>
  );
}
