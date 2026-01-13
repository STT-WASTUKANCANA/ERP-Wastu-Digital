"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  createIncomingMail,
  reviewIncomingMail,
  updateIncomingMail,
  divisionReviewIncomingMail
} from "@/lib/api/mails/incoming";
import { TextareaField } from "@/components/ui/textarea-field";
import { PdfPreview } from "@/components/ui/pdf-preview";
import { SubmitButton } from "@/components/ui/submit-button";

interface IncomingFormProps {
  categories: any[];
  divisions?: any[];
  initialData?: any;
  mode?: "create" | "edit" | "review" | "division_review";
  roleId?: number;
}

export default function IncomingForm({
  categories,
  divisions = [],
  initialData,
  mode = "create",
  roleId = 0,
}: IncomingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState({
    number: "",
    category_id: "",
    date: "",
    desc: "",
    attachment: "",
    status: 0,
    division_id: "",
    sekum_desc: "",
    division_desc: "",
    follow_status: "",
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
        status: initialData.status || 0,
        division_id: initialData.division_id ? String(initialData.division_id) : "",
        sekum_desc: initialData.sekum_desc || "",
        division_desc: initialData.division_desc || "",
        follow_status: initialData.follow_status || "",
      });
    }
  }, [initialData, categories]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const actions = {
    create: () => createIncomingMail(data),
    edit: () => updateIncomingMail(data, initialData.id),
    review: () => reviewIncomingMail(data, initialData.id),
    division_review: () => divisionReviewIncomingMail(data, initialData.id),
  };

  let data: FormData;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      data = new FormData();

      if (mode === "review") {
        data.append("division_id", formData.division_id);
        data.append("desc", formData.sekum_desc);
        data.append("_method", "PUT");
      } else if (mode === "division_review") {
        data.append("follow_status", formData.follow_status);
        data.append("division_desc", formData.division_desc);
        data.append("_method", "PUT");
      } else {
        const { attachment, division_id, sekum_desc, division_desc, follow_status, ...rest } =
          formData;

        Object.entries(rest).forEach(([key, value]) =>
          data.append(key, String(value))
        );

        if (files.length > 0) {
          data.append("attachment", files[0]);
        }

        if (mode === "edit") {
          data.append("_method", "PUT");
        }
      }

      const actionToCall = {
        create: actions.create,
        edit: actions.edit,
        review: actions.review,
        division_review: actions.division_review,
      }[mode];

      const res = await actionToCall?.();

      if (res?.ok) {
        const messages = {
          create: "Surat berhasil dibuat.",
          edit: "Surat berhasil dirubah.",
          review: "Surat berhasil ditinjau.",
          division_review: "Status berhasil diperbarui.",
        };
        alert(messages[mode]);
        router.push("/workspace/mail/incoming");
      } else {
        console.error("API Error:", res);
        if (res?.data?.errors) {
          setErrors(res.data.errors);
        }
        alert(`Operasi gagal: ${res?.data?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert(`Terjadi kesalahan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  const isFieldDisabled = mode === "review" || mode === "division_review";
  const showMainFormSubmit = mode === "create" || mode === "edit";
  const showAttachmentPreview = (mode === "edit" || mode === "review" || mode === "division_review") && formData.attachment;

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white p-8 rounded-lg shadow space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-8">
          <div className="col-span-2">
            <Input
              label="Nomor Surat"
              id="number"
              name="number"
              type="text"
              value={formData.number}
              onChange={handleChange}
              placeholder="Contoh: IM-001/STT/2025"
              disabled={isFieldDisabled}
              error={errors.number?.[0]}
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
              disabled={isFieldDisabled}
              error={errors.category_id?.[0]}
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
              disabled={isFieldDisabled}
              error={errors.date?.[0]}
            />
          </div>

          <TextareaField
            label="Deskripsi"
            id="desc"
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            placeholder="Tulis deskripsi surat..."
            disabled={isFieldDisabled}
            className="col-span-2"
          />

          {showAttachmentPreview && (
            <PdfPreview attachment={formData.attachment} className="col-span-2" />
          )}

          {showMainFormSubmit && (
            <div className="col-span-2">
              <FileDropzone
                label={
                  mode === "edit"
                    ? "Upload Lampiran Baru (Opsional, akan menggantikan yang lama)"
                    : "Lampiran Surat"
                }
                name="attachment"
                onFilesAccepted={(accepted) => setFiles(accepted)}
                error={errors.attachment?.[0]}
              />
            </div>
          )}

          {showMainFormSubmit && (
            <div className="col-span-2">
              <SubmitButton
                loading={loading}
                submitText="Simpan"
              />
            </div>
          )}
        </div>
      </div>

      {mode === "review" && (
        <div className="bg-white p-8 rounded-lg shadow space-y-8 mt-4">
          <div className="col-span-2">
            <Select
              label="Bagikan ke Bagian"
              id="division_id"
              name="division_id"
              onChange={handleChange}
              value={formData.division_id}
              placeholder="Pilih bagian"
              options={divisions.map((division) => ({
                value: String(division.id),
                label: division.name,
              }))}
            />
          </div>

          <TextareaField
            label="Catatan Sekretaris Umum"
            id="sekum_desc"
            name="sekum_desc"
            value={formData.sekum_desc}
            onChange={handleChange}
            placeholder="Tulis catatan atau instruksi..."
            className="col-span-2"
          />

          <div className="col-span-2">
            <SubmitButton loading={loading} submitText="Simpan" />
          </div>
        </div>
      )}

      {mode === "division_review" && (
        <div className="bg-white p-8 rounded-lg shadow space-y-8 mt-4">
          <div className="col-span-2">
            <Select
              label="Status Proses"
              id="follow_status"
              name="follow_status"
              value={formData.follow_status}
              onChange={handleChange}
              placeholder="Pilih status proses"
              options={[
                { value: 1, label: "Pending" },
                { value: 2, label: "Proses" },
                { value: 3, label: "Selesai" },
              ]}
            />
          </div>

          <TextareaField
            label="Deskripsi Bidang"
            id="division_desc"
            name="division_desc"
            value={formData.division_desc}
            onChange={handleChange}
            placeholder="Tulis deskripsi..."
            className="col-span-2"
          />

          <div className="col-span-2">
            <SubmitButton loading={loading} submitText="Simpan" />
          </div>
        </div>
      )}
    </form>
  );
}

