"use client";

import { useState, MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { FiDownload, FiEdit, FiTrash2 } from 'react-icons/fi';
import { HiOutlineUpload } from 'react-icons/hi';

import { IncomingMail } from '@/types/mail-props';
import { OffcanvasDetail } from '@/components/shared/OffcanvasDetail';
import { PageHeader } from '@/components/shared/PageHeader';
import { TableContainer } from '@/components/shared/TableContainer';
import { ColumnDef, DataTable } from '../../../shared/Datatable';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';

const IncomingMailTable = ({ incomingMails }: { incomingMails: IncomingMail[] }) => {
  const [selectedMail, setSelectedMail] = useState<IncomingMail | null>(null);
  const [createdModal, setCreatedModal] = useState(false);

  const handleRowClick = (mail: IncomingMail) => {
    if (window.innerWidth < 1024) {
      setSelectedMail(mail);
    }
  };

  const handleCloseOffcanvas = () => setSelectedMail(null);

  const handleActionClick = (e: MouseEvent, action: string, mailId: string) => {
    e.stopPropagation();
    console.log(`${action} clicked for mail ID: ${mailId}`);
  };

  const columns: ColumnDef<IncomingMail>[] = [
    {
      header: 'Mail Number',
      accessorKey: 'number',
    },
    {
      header: 'Date',
      accessorKey: 'date',
    },
    {
      header: 'Category',
      accessorKey: 'category_name',
    },
    {
      header: 'User',
      accessorKey: 'user_name',
      cell: (row) => row.user_name || '-',
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex justify-start items-center gap-2">
          <Button
            rounded="rounded-md"
            onClick={(e) => handleActionClick(e, 'Download', row.id)}
            className="p-2 bg-background hover:bg-muted border border-secondary/20"
          >
            <FiDownload className="w-3.5 h-3.5 text-foreground/80" />
          </Button>
          <Button
            rounded="rounded-md"
            onClick={(e) => handleActionClick(e, 'Edit', row.id)}
            className="p-2 bg-background hover:bg-muted border border-secondary/20"
          >
            <FiEdit className="w-3.5 h-3.5 text-primary" />
          </Button>
          <Button
            rounded="rounded-md"
            onClick={(e) => handleActionClick(e, 'Delete', row.id)}
            className="p-2 bg-background hover:bg-muted border border-secondary/20"
          >
            <FiTrash2 className="w-3.5 h-3.5 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

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
        <Button className="bg-primary text-background text-sm cursor-pointer px-4 py-2" onClick={() => {
          setCreatedModal(true)
        }}>+</Button>
      </PageHeader>

      {(createdModal) && (
        <Modal
          isOpen={createdModal}
          onClose={() => {
            setCreatedModal(false)
          }}
          title="Tambah Data Baru"
          size="xl"
          footer={
            <>
              <Button
                onClick={() => {
                  setCreatedModal(false)
                }}
                className="bg-secondary/20 text-foreground text-sm px-4 py-2"
              >
                Batal
              </Button>
              <Button
                onClick={() => {
                  alert('Data Disimpan!');
                  setCreatedModal(false)
                }}
                className="bg-primary text-sm text-white px-4 py-2"
              >
                Simpan Data
              </Button>
            </>
          }
        >
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-1">
                Nama Lengkap
              </label>
              <Input id="name" type="text" placeholder="Masukkan nama Anda" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-1">
                Alamat Email
              </label>
              <Input id="email" type="email" placeholder="contoh@email.com" />
            </div>
          </form>
        </Modal>
      )}

      <TableContainer onSearchChange={(value) => console.log('Searching for:', value)}>
        <DataTable
          columns={columns}
          data={incomingMails}
          onRowClick={handleRowClick}
          emptyStateMessage="No incoming mails found."
        />
      </TableContainer>

      {selectedMail && <OffcanvasDetail mail={selectedMail} onClose={handleCloseOffcanvas} />}
    </div>
  );
};

export default IncomingMailTable;