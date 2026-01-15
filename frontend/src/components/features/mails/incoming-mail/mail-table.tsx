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
  statusMap,
  outgoingStatusMap,
} from "@/types/mail-props";
import { DataDetailSheet } from "@/components/shared/data-detail-sheet";
import { Badge } from "@/components/ui/badge";
import { formatDate, getStorageUrl } from "@/lib/utils";
import { FiEdit, FiTrash2, FiSave, FiDownload } from "react-icons/fi";
import { validateOutgoingMail } from "@/lib/api/mails/outgoing";
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
  const [validationStatus, setValidationStatus] = useState<string>(''); // Outgoing Validation

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
    setStartDate("");
    setEndDate("");
    setSelectedCategory("");
    setStatus("");
    setDestination("");
    setViewStatus("");
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

  const columns = useMemo(
    () => config.getColumns(handleActionClick, roleId, userId),
    [roleId, userId]
  );

  const visibleColumns = useMemo(() => {
    return columns.filter((col) => {
      const key = (col.accessorKey || col.id || col.header) as string;
      return !hiddenColumns.includes(key);
    });
  }, [columns, hiddenColumns]);

  const allColumnsForModal = useMemo(() => {
    return columns.map(col => ({
      key: (col.accessorKey || col.id || col.header) as string,
      label: (col.header as string) || "Aksi"
    })).filter(c => c.label !== "");
  }, [columns]);

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

      <ColumnSelectorModal
        isOpen={showColumnModal}
        onClose={() => setShowColumnModal(false)}
        columns={allColumnsForModal}
        hiddenColumns={hiddenColumns}
        mandatoryColumns={["number"]}
        onSave={handleSaveColumns}
      />

      {selectedMail && (() => {
        let title = "Detail Surat";
        let items: any[] = [];
        let extraFooter: React.ReactNode = null;
        let attachment = selectedMail.attachment ? {
          url: selectedMail.attachment.startsWith('http') ? selectedMail.attachment : getStorageUrl(selectedMail.attachment),
          fileName: selectedMail.attachment.startsWith('http') ? 'Buka Link' : 'Download Attachment'
        } : undefined;

        if (type === "incoming") {
          const mail = selectedMail as IncomingMail;
          title = "Detail Surat Masuk";
          const getBadge = (s: number, f: number) => {
            if (s === 2 && f === 2) return { label: "Proses", color: "bg-yellow-100 text-yellow-800" };
            const m: any = { 1: { l: statusMap[1], c: "bg-secondary text-white" }, 2: { l: statusMap[2], c: "bg-blue-100 text-blue-800" }, 3: { l: statusMap[3], c: "bg-green-100 text-green-800" } };
            const d = m[s] || { l: "Unknown", c: "bg-gray-100 text-gray-800" };
            return { label: d.l, color: d.c };
          };
          const b = getBadge(mail.status, mail.follow_status);
          items = [
            { label: "Nomor Surat", value: mail.number },
            { label: "Tanggal", value: formatDate(mail.date) },
            { label: "Kategori", value: mail.category_name },
            { label: "Oleh", value: mail.user_name || '-' },
            { label: "Status", value: <span className={`px-2 py-1 rounded-sm text-xs font-semibold ${b.color}`}>{b.label}</span> },
            { label: "Divisi", value: mail.division_name || '-' },
            { label: "Perihal", value: mail.desc }
          ];
        } else if (type === "outgoing") {
          const mail = selectedMail as OutgoingMail;
          title = "Detail Surat Keluar";
          items = [
            { label: "Nomor Surat", value: mail.number },
            { label: "Tanggal", value: formatDate(mail.date) },
            { label: "Kategori", value: mail.category_name },
            { label: "Oleh", value: mail.user_name },
            { label: "Instansi", value: mail.institute },
            { label: "Alamat", value: mail.address },
            { label: "Status", value: <Badge value={String(mail.status)} map={outgoingStatusMap} /> },
            { label: "Tujuan", value: mail.purpose },
            { label: "Perihal", value: mail.desc }
          ];

          // Validation Logic
          if (roleId === 2 && mail.status === '1') {
            extraFooter = (
              <div className="flex flex-col gap-2 mb-2 p-3 bg-secondary/5 rounded-lg border border-secondary/10">
                <p className="text-xs font-semibold text-secondary">Validasi Sekum</p>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Select
                      options={[
                        { value: '2', label: 'Perlu Perbaikan' },
                        { value: '3', label: 'Disetujui' },
                        { value: '4', label: 'Ditolak' }
                      ]}
                      value={validationStatus}
                      onChange={(e) => setValidationStatus(e.target.value)}
                      placeholder="Pilih Status"
                      className="text-xs h-9 py-1"
                    />
                  </div>
                  <Button
                    onClick={async () => {
                      if (!validationStatus) return;
                      if (confirm(`Ubah status ke ${outgoingStatusMap[Number(validationStatus)]?.label || validationStatus}?`)) {
                        const res = await validateOutgoingMail(Number(mail.id), validationStatus);
                        if (res.ok) { alert('Berhasil'); window.location.reload(); }
                        else { alert('Gagal'); }
                      }
                    }}
                    disabled={!validationStatus}
                    className="bg-primary text-white hover:bg-primary/90 text-xs h-9 px-3"
                  >
                    <FiSave className="mr-1" /> Simpan
                  </Button>
                </div>
              </div>
            );
          }
        } else if (type === "decision") {
          const mail = selectedMail as DecisionMail;
          title = "Detail Surat Keputusan";
          items = [
            { label: "Nomor Surat", value: mail.number },
            { label: "Tanggal", value: formatDate(mail.date) },
            { label: "Kategori", value: mail.category_name },
            { label: "Oleh", value: mail.user_name || '-' },
            { label: "Judul", value: mail.title },
            { label: "Deskripsi", value: mail.desc }
          ];
        }

        return (
          <DataDetailSheet
            title={title}
            items={items}
            onClose={() => { setSelectedMail(null); setValidationStatus(''); }}
            attachment={attachment}
            actions={[
              { label: "Edit", onClick: (e) => handleActionClick(e, 'Edit', String(selectedMail.id)), variant: 'primary', icon: FiEdit },
              { label: "Delete", onClick: (e) => handleActionClick(e, 'Delete', String(selectedMail.id)), variant: 'danger', icon: FiTrash2 }
            ]}
            extraFooter={extraFooter}
          />
        );
      })()}
    </>
  );
};

export default MailTable;
