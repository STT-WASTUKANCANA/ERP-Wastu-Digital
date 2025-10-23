"use client";

import IncomingForm from "@/components/features/mails/incomingMail/incoming-form";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { detailIncomingMail, getMailCategories } from "@/lib/api/mails/incoming";
import { getDivisionList } from "@/lib/api/master/division";
import React, { useEffect, useState } from "react";
import { FiCornerDownLeft } from "react-icons/fi";

export default function Page() {
  const [categories, setCategories] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [mail, setMail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mailId = sessionStorage.getItem("reviewMailId");

    if (!mailId) {
      alert("No mail selected for review. Redirecting...");
      window.location.href = "/workspace/mail/incoming";
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const [categoriesRes, mailRes, divisionsRes] = await Promise.all([
          getMailCategories(),
          detailIncomingMail(Number(mailId)),
          getDivisionList(),
        ]);

        setCategories(categoriesRes.data?.data || []);
        setMail(mailRes.data?.data || null);
        setDivisions(divisionsRes.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch mail data:", error);
        alert("Unable to load the mail details. Please try again later.");
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
