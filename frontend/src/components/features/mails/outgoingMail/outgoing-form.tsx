"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createOutgoingMail, updateOutgoingMail } from "@/lib/api/mails/outgoing";
import { FormWrapper } from "@/components/ui/form-wrapper";
import { TextareaField } from "@/components/ui/textarea-field";
import { PdfPreview } from "@/components/ui/pdf-preview";
import { SubmitButton } from "@/components/ui/submit-button";

interface OutgoingFormProps {
  categories: any[];
  divisions?: any[];
  initialData?: any;
  mode?: "create" | "edit";
  roleId?: number;
}

export default function OutgoingForm({
  categories,
  initialData,
  mode = "create",
}: OutgoingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

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
    const { attachment, status, ...rest } = formData;

    Object.entries(rest).forEach(([key, value]) => {
      data.append(key, String(value));
    });

    if (files.length > 0) {
      data.append("attachment", files[0]);
    }

    if (mode === "edit") {
      data.append("_method", "PUT");
    }

    const res =
      mode === "edit"
        ? await updateOutgoingMail(data, initialData.id)
        : await createOutgoingMail(data);

    if (res.ok) {
      alert(mode === "edit" ? "Surat berhasil diperbarui." : "Surat berhasil dibuat.");
      router.push("/workspace/mail/outgoing");
    } else {
      alert("Operasi gagal.");
    }

    setLoading(false);
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <div className="col-span-2">
        <Input
          label="Nomor Surat"
          id="number"
          name="number"
          type="text"
          value={formData.number}
          onChange={handleChange}
          placeholder="Contoh: OUT-001/STT/2025"
        />
      </div>

      <div>
        <Select
          label="Kategori Surat"
          id="category_id"
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          placeholder="Pilih kategori"
          options={categories.map((cat) => ({
            value: cat.id,
            label: cat.name,
          }))}
        />
      </div>

      <div>
        <Input
          label="Tanggal Surat"
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
        />
      </div>

      <div>
        <Input
          label="Instansi"
          id="institute"
          name="institute"
          type="text"
          value={formData.institute}
          onChange={handleChange}
          placeholder="Nama instansi"
        />
      </div>

      <div>
        <Input
          label="Tujuan Surat"
          id="purpose"
          name="purpose"
          type="text"
          value={formData.purpose}
          onChange={handleChange}
          placeholder="Contoh: Undangan rapat kerja"
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
      />

      <TextareaField
        label="Deskripsi"
        id="desc"
        name="desc"
        value={formData.desc}
        onChange={handleChange}
        placeholder="Isi deskripsi surat..."
        className="col-span-2"
      />

      {mode === "edit" && formData.attachment && (
        <PdfPreview attachment={formData.attachment} className="col-span-2" />
      )}

      <div className="col-span-2">
        <FileDropzone
          label={mode === "edit" ? "Upload Lampiran Baru (Opsional)" : "Lampiran (PDF)"}
          name="attachment"
          onFilesAccepted={(accepted) => setFiles(accepted)}
        />
      </div>

      <div className="col-span-2">
        <SubmitButton
          loading={loading}
          submitText={mode === "edit" ? "Update Surat" : "Submit"}
        />
      </div>
    </FormWrapper>
  );
}

