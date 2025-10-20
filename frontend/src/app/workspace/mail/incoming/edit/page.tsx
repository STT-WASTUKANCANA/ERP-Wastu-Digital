"use client";

import { useEffect, useState } from "react";
import { FiCornerDownLeft } from "react-icons/fi";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { getMailCategories, detailIncomingMail } from "@/lib/api/mails/incoming";
import IncomingForm from "@/components/features/mails/incomingMail/incoming-form";

export default function Page() {
  const [categories, setCategories] = useState([]);
  const [mail, setMail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mailId = sessionStorage.getItem('editingMailId');

    if (!mailId) {
      alert("No mail selected for editing. Redirecting...");
      window.location.href = "/workspace/mail/incoming";
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [categoriesRes, mailRes] = await Promise.all([
          getMailCategories(),
          detailIncomingMail(Number(mailId)),
        ]);

        console.log(mailRes.data?.data);
        

        setCategories(categoriesRes.data?.data || []);
        setMail(mailRes.data?.data || null);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        alert("Failed to load mail data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

      {mail && <IncomingForm categories={categories} initialData={mail} mode="edit" />}
    </div>
  );
}