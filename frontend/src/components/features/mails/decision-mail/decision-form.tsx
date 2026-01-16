"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
// import { FileDropzone } from "@/components/ui/file-dropzone"; // Removed
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createDecisionMail, updateDecisionMail } from "@/lib/api/mails/decision";
import { FormWrapper } from "@/components/ui/form-wrapper";
import { TextareaField } from "@/components/ui/textarea-field";
import { PdfPreview } from "@/components/ui/pdf-preview";
import { SubmitButton } from "@/components/ui/submit-button";

import { DecisionFormProps } from "@/types/features/mail/decision";

export default function DecisionForm({
  categories,
  initialData,
  mode = "create",
}: DecisionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // const [files, setFiles] = useState<File[]>([]); // Removed

  const [formData, setFormData] = useState({
    number: "",
    category_id: "",
    date: "",
    title: "",
    desc: "",
    attachment: "",
    status: 0,
  });

  useEffect(() => {
    if (initialData) {
      const matchedCategoryId =
        initialData.category_id || categories.find((c) => c.name === initialData.category_name)?.id || "";

      setFormData({
        number: initialData.number || "",
        category_id: matchedCategoryId,
        date: initialData.date ? initialData.date.split("T")[0] : "",
        title: initialData.title || "",
        desc: initialData.desc || "",
        attachment: initialData.attachment || "",
        status: initialData.status || 0,
      });
    }
  }, [initialData, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    // const { attachment, ...rest } = formData;
    Object.entries(formData).forEach(([key, value]) => data.append(key, String(value)));
    // if (files.length > 0) data.append("attachment", files[0]); // Removed
    if (mode === "edit") data.append("_method", "PUT");

    const res = mode === "edit"
      ? await updateDecisionMail(data, initialData.id)
      : await createDecisionMail(data);

    if (res.ok) {
      alert(mode === "edit" ? "Surat keputusan diperbarui." : "Surat keputusan dibuat.");
      router.push("/workspace/mail/decision");
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
          name="number"
          value={formData.number}
          onChange={handleChange}
          placeholder="Contoh: SK-001/IX/2025"
        />
      </div>
      <div>
        <Select
          label="Kategori Surat"
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          placeholder="Pilih kategori"
          options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
        />
      </div>
      <div>
        <Input
          label="Tanggal Surat"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
        />
      </div>
      <div className="col-span-2">
        <Input
          label="Judul Surat"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Judul surat keputusan"
        />
      </div>
      <TextareaField
        label="Deskripsi"
        name="desc"
        value={formData.desc}
        onChange={handleChange}
        placeholder="Isi deskripsi surat keputusan..."
        className="col-span-2"
      />
      {mode === "edit" && formData.attachment && (
        <PdfPreview attachment={formData.attachment} className="col-span-2" />
      )}
      <div className="col-span-2">
        <Input
          label="Link Google Drive (URL)"
          name="attachment"
          value={formData.attachment}
          onChange={handleChange}
          placeholder="https://drive.google.com/..."
        />
        {/* <FileDropzone ... /> Removed */}
      </div>
      <div className="col-span-2">
        <SubmitButton
          loading={loading}
          submitText="Simpan"
        />
      </div>
    </FormWrapper>
  );
}

