"use client";

import IncomingForm from "@/components/features/mails/incoming-mail/incoming-form";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useMailPageData } from "@/hooks/features/mail/use-mail-page-data";
import { FiCornerDownLeft } from "react-icons/fi";

export default function Page() {

  const { categories, divisions, mail, isLoading } = useMailPageData({
    mailIdSessionKey: "divisionReviewMailId",
    mailType: "incoming",
    fetchDivisions: true,
  });

  if (isLoading) {
    return <div>Memproses data surat...</div>;
  }

  return (
    <div className="space-y-8 lg:px-24 xl:px-56">
      <PageHeader
        title="Tinjau Surat Masuk"
        description="Tinjau dan ubah detail data surat masuk yang sudah ada."
      >
        <Button
          color="bg-background"
          className="flex items-center justify-center gap-2 px-8 py-2 text-sm text-foreground border border-secondary/20 cursor-pointer"
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
          divisions={divisions}
          mode="division_review"
        />
      )}
    </div>
  );
}
