"use client";

import React, { useState } from 'react'; 
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectOption } from '@/components/ui/select';
import { FileDropzone } from '@/components/ui/file-dropzone';

interface IncomingCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IncomingCreateModal = ({ isOpen, onClose }: IncomingCreateModalProps) => {
  // 1. Tambahkan state untuk menampung file yang di-upload
  const [attachment, setAttachment] = useState<File[]>([]);

  const categories: SelectOption[] = [
    { value: '1', label: 'Surat Undangan' },
    { value: '2', label: 'Surat Pemberitahuan' },
    { value: '3', label: 'Surat Dinas' },
  ];

  const handleSave = () => {
    // 6. Sekarang Anda bisa akses file yang dipilih dari state
    console.log("File yang akan disimpan:", attachment);
    alert('Data Disimpan!');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Surat Masuk Baru"
      size="xl"
      footer={
        <>
          <Button onClick={onClose} className="bg-secondary/20 text-foreground text-sm px-4 py-2">
            Batal
          </Button>
          <Button onClick={handleSave} className="bg-primary text-sm text-white px-4 py-2">
            Simpan Data
          </Button>
        </>
      }
    >
      {/* 2. Terapkan layout grid pada form (12 kolom di layar medium ke atas) */}
      <form className="grid grid-cols-1 md:grid-cols-12 gap-4">

        {/* 3. Atur kolom untuk input pertama (6 dari 12) */}
        <div className="md:col-span-6">
          <Input
            label="Nomor Surat"
            id="mail-number"
            type="text"
            placeholder="Contoh: SM-001/RT/2025"
          />
        </div>

        {/* 4. Atur kolom untuk input kedua (6 dari 12) */}
        <div className="md:col-span-6">
          <Input
            label="Tanggal Surat"
            id="mail-date"
            type="date"
          />
        </div>

        <div className="col-span-12">
          <Select
            label="Kategori Surat"
            id="mail-category"
            options={categories}
            placeholder="-- Pilih Kategori --"
            defaultValue=""
          />
        </div>

        <div className="col-span-12">
          <FileDropzone
            label="Lampiran (File)"
            onFilesAccepted={(files) => setAttachment(files)}
          />
        </div>

      </form>
    </Modal>
  );
};