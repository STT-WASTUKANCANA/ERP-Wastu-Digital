"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { createOutgoingMail, updateOutgoingMail, validateOutgoingMail } from "@/lib/api/mails/outgoing";
import { FormWrapper } from "@/components/ui/form-wrapper";
import { TextareaField } from "@/components/ui/textarea-field";
import { PdfPreview } from "@/components/ui/pdf-preview";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormCard } from "@/components/ui/form-card";

import { OutgoingFormProps } from "@/types/features/mail/outgoing";
import { showToast, showSuccessDialog } from "@/lib/sweetalert";

export default function OutgoingForm({
  categories,
  initialData,
  mode = "create",
  roleId,
}: OutgoingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [validationStatus, setValidationStatus] = useState<string>("");
  const [validationNote, setValidationNote] = useState<string>("");
  const isSekumVerification = roleId === 2 && mode === "edit";
  const isApproved = initialData?.status === 3 || initialData?.status === '3';
  // Creator (Tata Laksana/Others) cannot edit if already approved
  // Admin (5) should be able to edit regardless of approval
  const isCreatorReadOnly = ![2, 5].includes(roleId || 0) && mode === "edit" && isApproved;
  const isReadOnly = isSekumVerification || isCreatorReadOnly;

  const [formData, setFormData] = useState({
    number: "",
    category_id: "",
    date: "",
    desc: "",
    attachment: "",
    institute: "",
    address: "",
    purpose: "",
    status: 0,
  });

  useEffect(() => {
    if (initialData) {
      const matchedCategoryId =
        initialData.category_id ||
        categories.find((c) => c.name === initialData.category_name)?.id ||
        "";

      setFormData({
        number: initialData.number || "",
        category_id: matchedCategoryId,
        date: initialData.date ? initialData.date.split("T")[0] : "",
        desc: initialData.desc || "",
        attachment: initialData.attachment || "",
        institute: initialData.institute || "",
        address: initialData.address || "",
        purpose: initialData.purpose || "",
        status: initialData.status || 0,
      });

      // Initialize validation fields if existing
      // If status is Pending (1), set to empty to show placeholder.
      // Otherwise set to the existing status (2, 3, or 4).
      if (initialData.status && String(initialData.status) !== '1') {
        setValidationStatus(String(initialData.status));
      } else {
        setValidationStatus("");
      }

      if (initialData.validation_note) {
        setValidationNote(initialData.validation_note);
      }

      // If approved, we might want to fill validation fields from log if available, but for now just Read Only form
    }
  }, [initialData, categories]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    const { status, ...rest } = formData;

    Object.entries(rest).forEach(([key, value]) => {
      data.append(key, String(value));
    });

    // Link attachment is already in 'rest' since we removed 'attachment' destructuring exclusion? 
    // Wait, let's check the destructuring line above. I need to edit that too.

    if (mode === "edit") {
      data.append("_method", "PUT");
    }

    const res =
      mode === "edit"
        ? await updateOutgoingMail(data, initialData.id)
        : await createOutgoingMail(data);

    if (res.ok) {
      await showSuccessDialog("Berhasil", mode === "edit" ? "Surat berhasil diperbarui." : "Surat berhasil dibuat.");
      router.push("/workspace/mails/outgoing");
    } else {
      showToast("error", "Operasi gagal.");
    }

    setLoading(false);
  };

  const handleValidation = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!validationStatus) return;

    setLoading(true);
    const res = await validateOutgoingMail(Number(initialData.id), validationStatus, validationNote);
    if (res.ok) {
      await showSuccessDialog("Berhasil", "Status surat berhasil diperbarui.");
      router.push("/workspace/mails/outgoing");
    } else {
      try {
        const errorData = res.data;
        showToast("error", `Gagal memvalidasi surat: ${res.status} - ${errorData?.message || JSON.stringify(errorData)}`);
      } catch (e) {
        showToast("error", `Gagal memvalidasi surat: ${res.status}`);
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" >
      {/* Helper Card for Creator if Status is 'Perlu Perbaikan' */}
      {roleId !== 2 && (initialData?.status === 2 || initialData?.status === '2') && initialData?.validation_note && (
        <FormCard className="mb-8">
          <div className="space-y-8">
            <Select
              label="Status"
              options={[
                { value: '2', label: 'Perlu Perbaikan' },
              ]}
              value={'2'} // Always '2' in this conditional block
              onChange={() => { }}
              placeholder="Perlu Perbaikan"
              disabled={true}
            />
            <TextareaField
              label="Catatan Sekretaris Umum"
              id="validationNoteDisplay"
              name="validationNoteDisplay"
              value={initialData.validation_note}
              disabled={true}
              placeholder=""
              className="w-full"
              onChange={() => { }}
            />
          </div>
        </FormCard>
      )}

      <FormCard>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-8">
          <div className="col-span-2">
            <Input
              label="Nomor Surat"
              id="number"
              name="number"
              type="text"
              value={formData.number}
              onChange={handleChange}
              placeholder="Contoh: OUT-001/STT/2025"
              disabled={isReadOnly}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <SearchableSelect
              label="Kategori Surat"
              // id="category_id"
              // name="category_id"
              value={formData.category_id}
              onChange={(val) => handleChange({ target: { name: 'category_id', value: val } } as any)}
              placeholder="Pilih kategori"
              disabled={isReadOnly}
              options={categories
                .filter((cat) => roleId === 3 ? cat.type === '3' : true)
                .map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                }))}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <Input
              label="Tanggal Surat"
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              disabled={isReadOnly}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <Input
              label="Tujuan Surat / PIC"
              id="institute"
              name="institute"
              type="text"
              value={formData.institute}
              onChange={handleChange}
              placeholder="Nama instansi"
              disabled={isReadOnly}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <Input
              label="Tujuan Surat"
              id="purpose"
              name="purpose"
              type="text"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Contoh: Undangan rapat kerja"
              disabled={isReadOnly}
            />
          </div>

          <TextareaField
            label="Alamat Instansi"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Alamat lengkap instansi"
            className="col-span-2"
            disabled={isReadOnly}
          />

          <TextareaField
            label="Perihal"
            id="desc"
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            placeholder="Isi deskripsi surat..."
            className="col-span-2"
            disabled={isReadOnly}
          />

          {mode === "edit" && formData.attachment && (
            <PdfPreview attachment={formData.attachment} className="col-span-2" />
          )}

          <div className="col-span-2">
            <Input
              label="Link Lampiran (Google Drive / Cloud Storage)"
              id="attachment"
              name="attachment"
              type="text"
              value={formData.attachment}
              onChange={handleChange}
              placeholder="https://drive.google.com/..."
              disabled={isReadOnly}
            />
          </div>


          {!isSekumVerification && !isCreatorReadOnly && (
            <div className="col-span-2">
              <SubmitButton
                loading={loading}
                submitText="Simpan"
              />
            </div>
          )}
        </div>
      </FormCard>

      {
        isSekumVerification && (
          <FormCard className="mt-4">
            <div className="space-y-8">
              <div>
                <Select
                  label="Validasi Sekum"
                  options={[
                    { value: '4', label: 'Ditolak' },
                    { value: '2', label: 'Perlu Perbaikan' },
                    { value: '3', label: 'Disetujui' },
                  ]}
                  value={validationStatus}
                  onChange={(e) => setValidationStatus(e.target.value)}
                  placeholder="Pilih Status Validasi"
                />
              </div>

              <TextareaField
                label="Catatan Sekretaris Umum"
                id="validationNote"
                name="validationNote"
                value={validationNote}
                onChange={(e) => setValidationNote(e.target.value)}
                placeholder="Tulis catatan atau alasan validasi..."
              />

              <div className="col-span-2">
                {/* Only show Save button if status is 1 (Verifikasi Sekum/Pending) */}
                {(initialData?.status === 1 || initialData?.status === '1') && (
                  <button
                    type="button"
                    onClick={handleValidation}
                    disabled={!validationStatus || loading}
                    className="bg-primary text-white hover:bg-primary/90 px-6 py-2 rounded-md h-10 disabled:opacity-50 w-full"
                  >
                    {loading ? 'Processing...' : 'Simpan Status'}
                  </button>
                )}
              </div>
            </div>
          </FormCard>
        )
      }

    </form >
  );
}
