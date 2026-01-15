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
import { ColumnSelectorModal } from "@/components/shared/column-selector-modal";
import { FilterModal } from "@/components/shared/filter-modal";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type MailTypes = IncomingMail | OutgoingMail | DecisionMail;

const MailTable = <T extends MailTypes>({
  mails,
  onMailCreated,
  isLoading,
  type,
  onSearch,
  onFilterApply,
}: MailTableProps<T>) => {
  const router = useRouter();
  const { roleId, userId } = useRole();

  const config = mailConfig[type];

  const [selectedMail, setSelectedMail] = useState<T | null>(null);

  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter States
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [categories, setCategories] = useState<{ label: string, value: string }[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [status, setStatus] = useState("");
  const [destination, setDestination] = useState(""); // Outgoing
  const [viewStatus, setViewStatus] = useState(""); // Incoming

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      const res = await config.getCategories();
      if (res?.ok && res?.data?.data && Array.isArray(res.data.data)) {
        setCategories(res.data.data.map((c: any) => ({ label: c.name, value: String(c.id) })));
      }
    };
    fetchCats();
  }, [type, config]);

  const handleApplyFilter = () => {
    const filters: any = {};
    if (startDate) filters.start_date = startDate;
    if (endDate) filters.end_date = endDate;
    if (selectedCategory) filters.category_id = selectedCategory;
    if (status) filters.status = status;
    if (destination) filters.destination = destination;
    if (viewStatus) filters.user_view_id = viewStatus;

    onFilterApply?.(filters);
    setShowFilterModal(false);
  };

  const handleResetFilter = () => {
    setStartDate("");
    setEndDate("");
    setSelectedCategory("");
    setStatus("");
    setDestination("");
    setViewStatus("");
    onFilterApply?.({});
    setShowFilterModal(false);
  };

  // Reset page when switching mail types
  useEffect(() => {
    setCurrentPage(1);
    // Also reset filters? Maybe better UX to keep it or reset. 
    // User probably expects clear filters on tab switch or keep if compatible.
    // Given the complexity, I'll reset UI filters but `onFilterApply` handling at parent might persist.
    // Parent `mails-client` re-mounts or keeps state? `mails-client` keys by type? No.
    // `MailsClient` is single component.
    // Use clear filters logic when type changes?
    setStartDate("");
    setEndDate("");
    setSelectedCategory("");
    setStatus("");
    setDestination("");
    setViewStatus("");
    // Note: Parent state assumes clean slate or we should trigger clear.
    // But `mails-client` doesn't clear `filterParams` automatically on type switch unless we tell it.
    // Actually `type` changes via URL. `mails-client` derives type from URL.
    // Since page reload or navigation happens, state might reset naturally if component unmounts.
    // Next.js App Router usually remounts on route change unless using same layout/template.
    // `mails-client` is used in `page.tsx`.
    // So it should be fine.
  }, [type, mails]);

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

  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [showColumnModal, setShowColumnModal] = useState(false);

  // ... (previous code)

  const columns = useMemo(
    () => config.getColumns(handleActionClick, roleId, userId),
    [roleId, userId]
  );

  const visibleColumns = useMemo(() => {
    return columns.filter((col) => {
      // AccessorKey fallback for ID if needed, or use ID directly if available.
      // The modal needs a key.
      const key = (col.accessorKey || col.id || col.header) as string;
      return !hiddenColumns.includes(key);
    });
  }, [columns, hiddenColumns]);

  const allColumnsForModal = useMemo(() => {
    return columns.map(col => ({
      key: (col.accessorKey || col.id || col.header) as string,
      label: (col.header as string) || "Aksi" // Fallback label
    })).filter(c => c.label !== ""); // Filter out empty headers if any (usually actions has empty header, handle carefully)
  }, [columns]);

  // Handle saving columns
  const handleSaveColumns = (newHidden: string[]) => {
    setHiddenColumns(newHidden);
  };

  const canCreate =
    (roleId === 1 && type === "incoming") ||
    (type === "outgoing") ||
    (roleId === 3 && type === "decision");

  return (
    <>
      <PageHeader title={config.title} description={config.description}>
        <Button className="text-foreground/70 text-sm cursor-pointer px-8 py-2 flex justify-center items-center gap-2 border border-secondary/20 bg-background">
          <HiOutlineUpload />
          <span>Ekspor</span>
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
        onModifyColumnClick={() => setShowColumnModal(true)}
        onFilterClick={() => setShowFilterModal(true)}
        page={currentPage}
        total={mails.length}
        pageSize={entries}
        onPageChange={setCurrentPage}
      >
        <DataTable
          columns={visibleColumns}
          data={paginatedMails}
          onRowClick={handleRowClick}
          emptyStateMessage={`Tidak ada data ${type}.`}
          isLoading={isLoading}
        />
      </TableContainer>

      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
        title={`Filter ${config.title}`}
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Tanggal Awal</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Tanggal Akhir</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <Select
            label="Kategori"
            options={categories}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            placeholder="Semua Kategori"
          />

          {type === 'incoming' && (
            <>
              <Select
                label="Status"
                options={[
                  { label: 'Peninjauan', value: '1' },
                  { label: 'Disposisi', value: '2' },
                  { label: 'Selesai', value: '3' },
                ]}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Semua Status"
              />
              <Select
                label="Status Dilihat"
                options={[
                  { label: 'Sudah Dilihat', value: '1' },
                  { label: 'Belum Dilihat', value: '0' },
                ]}
                value={viewStatus}
                onChange={(e) => setViewStatus(e.target.value)}
                placeholder="Semua Status Dilihat"
              />
            </>
          )}

          {type === 'outgoing' && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Instansi</label>
                <Input
                  placeholder="Contoh: Dinas Kesehatan"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
              <Select
                label="Status"
                options={[
                  { label: 'Verifikasi Sekum', value: '1' },
                  { label: 'Perlu Perbaikan', value: '2' },
                  { label: 'Disetujui', value: '3' },
                  { label: 'Ditolak', value: '4' },
                ]}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Semua Status"
              />
            </>
          )}
        </div>
      </FilterModal>

      {/* Column Selector Modal */}
      <ColumnSelectorModal
        isOpen={showColumnModal}
        onClose={() => setShowColumnModal(false)}
        columns={allColumnsForModal}
        hiddenColumns={hiddenColumns}
        mandatoryColumns={["number"]}
        onSave={handleSaveColumns}
      />

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
