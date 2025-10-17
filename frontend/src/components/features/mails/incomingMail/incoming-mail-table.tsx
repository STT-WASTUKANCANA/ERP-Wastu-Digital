"use client";

import { useState, useMemo, MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { HiOutlineUpload } from 'react-icons/hi';
import { IncomingMail, IncomingMailTableProps } from '@/types/mail-props';
import { OffcanvasDetail } from '@/components/shared/offcanvas-detail';
import { PageHeader } from '@/components/shared/page-header';
import { TableContainer } from '@/components/shared/table-container';
import { DataTable } from '../../../shared/datatable';
import { IncomingCreateModal } from './incoming-create-modal';
import { getIncomingMailColumns } from './column';
import { deleteIncomingMail } from '@/lib/api/mails/incoming';
import { Toast } from '@/components/ui/toast';

const IncomingMailTable = ({ incomingMails, onMailCreated, isLoading }: IncomingMailTableProps) => {
  const [selectedMail, setSelectedMail] = useState<IncomingMail | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const [toast, setToast] = useState<{
    title: string;
    message: string;
    variant: 'success' | 'error' | 'warning' | 'info';
  } | null>(null);

  const handleRowClick = (mail: IncomingMail) => {
    if (window.innerWidth < 1024) {
      setSelectedMail(mail);
    }
  };

  const handleCloseOffcanvas = () => setSelectedMail(null);

  const handleActionClick = async (e: MouseEvent, action: string, mailId: string) => {
    e.stopPropagation();

    if (action === 'Download') {
      console.log('Downloading mail:', mailId);
      setToast({
        title: 'Download',
        message: 'Fitur download belum diimplementasikan.',
        variant: 'info',
      });
      return;
    }

    if (action === 'Edit') {
      console.log('Editing mail:', mailId);
      setToast({
        title: 'Edit',
        message: 'Fitur edit belum diimplementasikan.',
        variant: 'warning',
      });
      return;
    }

    if (action === 'Delete') {
      if (confirm('Yakin ingin menghapus surat ini?')) {
        try {
          await deleteIncomingMail(Number(mailId));
          setToast({
            title: 'Berhasil',
            message: 'Surat berhasil dihapus.',
            variant: 'success',
          });
          onMailCreated();
        } catch (err) {
          console.error(err);
          setToast({
            title: 'Gagal',
            message: 'Terjadi kesalahan saat menghapus surat.',
            variant: 'error',
          });
        }
      }
    }
  };

  const columns = useMemo(() => getIncomingMailColumns(handleActionClick), []);

  return (
    <div className='lg:p-8'>
      <PageHeader
        title="Incoming Mails"
        description="Manage all incoming mails efficiently."
      >
        <Button className="text-foreground/70 text-sm cursor-pointer px-8 py-2 flex justify-center items-center gap-2 border border-secondary/20 bg-background">
          <HiOutlineUpload />
          <span>Export</span>
        </Button>
        <Button
          className="bg-primary text-background text-sm cursor-pointer px-4 py-2"
          onClick={() => setCreateModalOpen(true)}
        >
          +
        </Button>
      </PageHeader>

      <TableContainer onSearchChange={(value) => console.log('Searching for:', value)}>
        <DataTable
          columns={columns}
          data={incomingMails}
          onRowClick={handleRowClick}
          emptyStateMessage="No incoming mails found."
          isLoading={isLoading}
        />
      </TableContainer>

      <IncomingCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={onMailCreated}
      />

      {selectedMail && <OffcanvasDetail mail={selectedMail} onClose={handleCloseOffcanvas} />}

      {/* tampilkan toast kalau ada */}
      {toast && (
        <Toast
          variant={toast.variant}
          title={toast.title}
          message={toast.message}
          duration={3000}
          showProgress
        />
      )}
    </div>
  );
};

export default IncomingMailTable;
