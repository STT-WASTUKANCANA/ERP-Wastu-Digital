"use client";

import { useState, useMemo, MouseEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { TableContainer } from "@/components/shared/table-container";
import { DataTable } from "@/components/shared/datatable";
import { IncomingMail } from "@/types/features/mail/incoming";
import { OutgoingMail } from "@/types/features/mail/outgoing";
import { DecisionMail } from "@/types/features/mail/decision";
import { MailTableProps } from "@/types/features/mail/common";
import { DataDetailSheet } from "@/components/shared/data-detail-sheet";
import { getStorageUrl } from "@/lib/utils";
import { FiEdit, FiTrash2, FiSave, FiDownload } from "react-icons/fi";
import { validateOutgoingMail } from "@/lib/api/mails/outgoing";
import { useRole } from "@/contexts/role";
import { mailConfig } from "@/lib/config/mail-config";
import { HiOutlineUpload } from "react-icons/hi";
import { ColumnSelectorModal } from "@/components/shared/column-selector-modal";
import { FilterModal } from "@/components/shared/filter-modal";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getMailDetailItems } from "@/lib/helpers/detail-helpers";
import { outgoingStatusMap } from "@/lib/constants/mail";
import { useMailFilter } from "@/hooks/features/mail/use-mail-filter";

import { exportIncomingMail, exportOutgoingMail, exportDecisionLetter } from "@/lib/actions/mail-export";
import { showToast } from "@/lib/sweetalert";
import { MailExportModal, MailExportFilters } from "@/components/shared/mail-export-modal";

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

  const {
    showFilterModal,
    setShowFilterModal,
    categories,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedCategory,
    setSelectedCategory,
    status,
    setStatus,
    destination,
    setDestination,
    viewStatus,
    setViewStatus,
    validationStatus,
    setValidationStatus,
    handleApplyFilter,
    handleResetFilter
  } = useMailFilter({ type, config, mails, onFilterApply });

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
  const [showExportModal, setShowExportModal] = useState(false);

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

  // Export handler
  const handleExport = async (exportType: 'excel' | 'pdf', filters: MailExportFilters) => {
    try {
      let result;
      if (type === 'incoming') {
        result = await exportIncomingMail(exportType, filters);
      } else if (type === 'outgoing') {
        result = await exportOutgoingMail(exportType, filters);
      } else {
        result = await exportDecisionLetter(exportType, filters);
      }

      // Convert base64 to blob and download
      const binaryString = atob(result.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: result.contentType });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast('success', 'Data berhasil diexport');
    } catch (error: any) {
      console.error('Export failed:', error);
      showToast('error', `Export gagal: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <>
      <PageHeader title={config.title} description={config.description}>
        <Button
          className="text-foreground/70 text-sm cursor-pointer px-8 py-2 flex justify-center items-center gap-2 border border-secondary/20 bg-background"
          onClick={() => setShowExportModal(true)}
        >
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
        const { title, items } = getMailDetailItems(type, selectedMail);
        let extraFooter: React.ReactNode = null;
        let attachment = selectedMail.attachment ? {
          url: selectedMail.attachment.startsWith('http') ? selectedMail.attachment : getStorageUrl(selectedMail.attachment),
          fileName: selectedMail.attachment.startsWith('http') ? 'Buka Link' : 'Unduh Dokumen'
        } : undefined;

        if (type === "outgoing") {
          const mail = selectedMail as OutgoingMail;
          // Logika validasi untuk Surat Keluar (Sekum)
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
        }

        return (
          <DataDetailSheet
            title={title}
            items={items}
            onClose={() => { setSelectedMail(null); setValidationStatus(''); }}
            attachment={attachment}
            actions={config.getActions ? config.getActions(selectedMail, roleId, userId, handleActionClick) : []}
            extraFooter={extraFooter}
          />
        );
      })()}

      <MailExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        title={`Export ${config.title}`}
        type={type as "incoming" | "outgoing" | "decision"}
        categories={categories}
      />
    </>
  );
};

export default MailTable;
