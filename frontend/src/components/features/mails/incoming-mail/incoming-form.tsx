"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Select } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  createIncomingMail,
  reviewIncomingMail,
  updateIncomingMail,
  divisionReviewIncomingMail
} from "@/lib/api/mails/incoming";
import { TextareaField } from "@/components/ui/textarea-field";
import { PdfPreview } from "@/components/ui/pdf-preview";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormCard } from "@/components/ui/form-card";

import { IncomingFormProps } from "@/types/features/mail/incoming";
import { showToast, showSuccessDialog } from "@/lib/sweetalert";

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
    division_ids: [] as string[],
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
        division_ids: initialData.divisions
          ? initialData.divisions.map((d: any) => String(d.id))
          : (initialData.division_id ? [String(initialData.division_id)] : []),
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

  const handleDivisionChange = (newValues: (string | number)[]) => {
    setFormData({ ...formData, division_ids: newValues.map(String) });
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
        formData.division_ids.forEach(id => {
          data.append("division_ids[]", id);
        });
        data.append("desc", formData.sekum_desc);
        data.append("_method", "PUT");
      } else if (mode === "division_review") {
        data.append("follow_status", formData.follow_status);
        data.append("division_desc", formData.division_desc);
        data.append("_method", "PUT");
      } else {
        const { division_ids, sekum_desc, division_desc, follow_status, ...rest } =
          formData;

        Object.entries(rest).forEach(([key, value]) =>
          data.append(key, String(value))
        );

        if (files.length > 0) {
          // Legacy file handling removed
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
        // Use showToast for these as they are redirects, or showSuccessAlert if we want to block until acknowledged?
        // Usually creation/edit followed by redirect uses toast or a quick alert.
        // Given user asked for "login berhasil pake sweet alert muncul ditengah", but others "menyesuaikan".
        // A toast is better for form submission success followed by redirect.
        await showSuccessDialog("Berhasil", messages[mode]);
        router.push("/workspace/mail/incoming");
      } else {
        console.error("API Error:", res);
        if (res?.data?.errors) {
          setErrors(res.data.errors);
        }
        showToast("error", `Operasi gagal: ${res?.data?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      showToast("error", `Terjadi kesalahan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  const isFieldDisabled = mode === "review" || mode === "division_review";
  const showMainFormSubmit = mode === "create" || mode === "edit";
  const showAttachmentPreview = (mode === "edit" || mode === "review" || mode === "division_review") && formData.attachment;

  return (
    <form onSubmit={handleSubmit}>
      <FormCard>
        <div className="flex flex-col xl:grid xl:grid-cols-2 gap-x-4 gap-y-8">
          <div className="w-full xl:col-span-2">
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
            <SearchableSelect
              label="Kategori Surat"
              // id="category_id"
              // name="category_id"
              value={formData.category_id}
              onChange={(val) => handleChange({ target: { name: 'category_id', value: val } } as any)}
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
            <DatePicker
              label="Tanggal Surat"
              // name="date"
              value={formData.date ? new Date(formData.date) : undefined}
              onChange={(date) => {
                const dateStr = date ? format(date, "yyyy-MM-dd") : "";
                handleChange({ target: { name: 'date', value: dateStr } } as any);
              }}
              disabled={isFieldDisabled}
              error={errors.date?.[0]}
            />
          </div>

          <TextareaField
            label="Perihal"
            id="desc"
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            placeholder="Tulis perihal surat..."
            disabled={isFieldDisabled}
            className="col-span-2"
            error={errors.desc?.[0]}
          />

          {showAttachmentPreview && (
            <PdfPreview attachment={formData.attachment} className="col-span-2" />
          )}

          {showMainFormSubmit && (
            <div className="col-span-2">
              <div className="col-span-2">
                <Input
                  label={
                    mode === "edit"
                      ? "Link Lampiran Baru (Opsional, akan menggantikan yang lama)"
                      : "Link Lampiran (Google Drive / Cloud Storage)"
                  }
                  id="attachment"
                  name="attachment"
                  type="text"
                  value={formData.attachment}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/..."
                  error={errors.attachment?.[0]}
                  disabled={isFieldDisabled}
                />
              </div>
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
      </FormCard>

      {mode === "review" && (
        <FormCard className="mt-4">
          <div className="col-span-2">
            <MultiSelect
              label="Bagikan ke Bagian"
              options={divisions.map((division) => ({
                value: String(division.id),
                label: division.name,
              }))}
              value={formData.division_ids}
              onChange={handleDivisionChange}
              placeholder="Pilih satu atau lebih bagian"
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
        </FormCard>
      )}

      {mode === "division_review" && (
        <>
          <FormCard className="mt-4">
            <div className="col-span-2">
              <TextareaField
                label="Catatan Sekretaris Umum"
                id="sekum_desc_review"
                name="sekum_desc"
                value={formData.sekum_desc}
                disabled={true} // Read only
                onChange={() => { }} // Read only
              />
            </div>
          </FormCard>

          <FormCard className="mt-4">
            <div className="col-span-2">
              <div className="bg-secondary/10 p-4 rounded-md border border-secondary/20">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Info:</span> Anda sedang melihat surat yang didisposisikan ke divisi Anda. Sistem telah mencatat bahwa Anda telah melihat surat ini.
                </p>
              </div>
            </div>
          </FormCard>
        </>
      )}
    </form>
  );
}

