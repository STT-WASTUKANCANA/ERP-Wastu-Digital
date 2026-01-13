"use client";

import { useState, useMemo, MouseEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { TableContainer } from "@/components/shared/table-container";
import { DataTable } from "@/components/shared/datatable";
import {
  IncomingMail,
  OutgoingMail,
  DecisionMail,
  MailTableProps,
} from "@/types/mail-props";
import { OffcanvasDetail } from "@/components/features/mails/incomingMail/offcanvas-detail";
import { OutgoingOffcanvasDetail } from "@/components/features/mails/outgoingMail/offcanvas-detail";
import { DecisionOffcanvasDetail } from "@/components/features/mails/decisionMail/offcanvas-detail";
import { useRole } from "@/contexts/role";
import { mailConfig } from "@/lib/config/mail-config";
import { HiOutlineUpload } from "react-icons/hi";

type MailTypes = IncomingMail | OutgoingMail | DecisionMail;

const MailTable = <T extends MailTypes>({
  mails,
  onMailCreated,
  isLoading,
  type,
  onSearch,
}: MailTableProps<T>) => {
  const router = useRouter();
  const { roleId, userId } = useRole();

  const config = mailConfig[type];

  const [selectedMail, setSelectedMail] = useState<T | null>(null);

  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when switching mail types
  useEffect(() => {
    setCurrentPage(1);
  }, [type, mails]); // Reset on mails change (search) too? This might be annoying on refresh but safer for search.

  const paginatedMails = useMemo(() => {
    const start = (currentPage - 1) * entries;
    const end = start + entries;
    return mails.slice(start, end);
  }, [mails, entries, currentPage]);

  const handleEntriesChange = (value: number) => {
    setEntries(value);
    setCurrentPage(1);
  };

  const handleRowClick = (mail: T) => {
    if (window.innerWidth < 1024) setSelectedMail(mail);
  };

  const handleActionClick = async (e: MouseEvent, action: string, mailId: string) => {
    e.stopPropagation();

    if (action === "Edit") {
      sessionStorage.setItem(`editingMailId`, mailId);
      router.push(config.editPath);
      return;
    }

    if (action === "Review") {
      sessionStorage.setItem(`reviewMailId`, mailId);
      router.push(config.reviewPath);
      return;
    }

    if (action === "Division Review") {
      sessionStorage.setItem(`divisionReviewMailId`, mailId);
      router.push(config.divisionReviewPath);
      return;
    }

    if (action === "Delete") {
      if (confirm("Yakin ingin menghapus surat ini?")) {
        await config.delete(Number(mailId));
        onMailCreated();
      }
    }
  };

  const columns = useMemo(
    () => config.getColumns(handleActionClick, roleId, userId),
    [roleId, userId]
  );

  const canCreate =
    (roleId === 1 && type === "incoming") ||
    (type === "outgoing") ||
    (roleId === 3 && type === "decision");

  return (
    <>
      <PageHeader title={config.title} description={config.description}>
        <Button className="text-foreground/70 text-sm cursor-pointer px-8 py-2 flex justify-center items-center gap-2 border border-secondary/20 bg-background">
          <HiOutlineUpload />
          <span>Export</span>
        </Button>

        {canCreate && (
          <Button
            className="bg-primary text-background text-sm px-4 py-2"
            onClick={() => {
              if (["incoming", "outgoing", "decision"].includes(type)) {
                router.push(config.createPath);
              } else {
                alert("Failed");
              }
            }}
          >
            +
          </Button>
        )}
      </PageHeader>

      <TableContainer
        onSearchChange={onSearch}
        onEntriesChange={handleEntriesChange}
        page={currentPage}
        total={mails.length}
        pageSize={entries}
        onPageChange={setCurrentPage}
      >
        <DataTable
          columns={columns}
          data={paginatedMails}
          onRowClick={handleRowClick}
          emptyStateMessage={`Tidak ada data ${type}.`}
          isLoading={isLoading}
        />
      </TableContainer>

      {selectedMail && type === "incoming" && (
        <OffcanvasDetail
          mail={selectedMail as IncomingMail}
          onClose={() => setSelectedMail(null)}
          onAction={handleActionClick}
        />
      )}

      {selectedMail && type === "outgoing" && (
        <OutgoingOffcanvasDetail
          mail={selectedMail as OutgoingMail}
          onClose={() => setSelectedMail(null)}
          onAction={handleActionClick}
        />
      )}

      {selectedMail && type === "decision" && (
        <DecisionOffcanvasDetail
          mail={selectedMail as DecisionMail}
          onClose={() => setSelectedMail(null)}
          onAction={handleActionClick}
        />
      )}
    </>
  );
};

export default MailTable;
