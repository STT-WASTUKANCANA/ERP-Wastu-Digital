"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
// import { FileDropzone } from "@/components/ui/file-dropzone"; // Removed
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Select } from "@/components/ui/select";
import { createDecisionMail, updateDecisionMail, getLatestDecisionNumber } from "@/lib/api/mails/decision";
import { FormWrapper } from "@/components/ui/form-wrapper";
import { TextareaField } from "@/components/ui/textarea-field";
import { PdfPreview } from "@/components/ui/pdf-preview";
import { SubmitButton } from "@/components/ui/submit-button";

import { DecisionFormProps } from "@/types/features/mail/decision";
import { showToast, showSuccessDialog } from "@/lib/sweetalert";

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

  const [protectedPrefix, setProtectedPrefix] = useState<string>("");

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

  useEffect(() => {
    const fetchNumber = async () => {
      if (mode === 'create' && formData.date) {
        try {
          const res = await getLatestDecisionNumber(formData.date);
          // @ts-ignore
          if (res.ok && res.data?.data?.number) {
            // @ts-ignore
            const num = res.data.data.number;
            setFormData(prev => ({ ...prev, number: num }));
            setProtectedPrefix(num);
          }
        } catch (e) {
          console.error("Failed to fetch number", e);
        }
      }
    };
    fetchNumber();
  }, [formData.date, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    if (mode === 'create' && protectedPrefix) {
      if (!newVal.startsWith(protectedPrefix)) {
        setFormData({ ...formData, number: protectedPrefix });
        return;
      }
    }
    setFormData({ ...formData, number: newVal });
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
      await showSuccessDialog("Berhasil", mode === "edit" ? "Surat keputusan diperbarui." : "Surat keputusan dibuat.");
      router.push("/workspace/mail/decision");
    } else {
      showToast("error", "Operasi gagal.");
    }

    setLoading(false);
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <div>
        <DatePicker
          label="Tanggal Surat"
          // name="date"
          value={formData.date ? new Date(formData.date) : undefined}
          onChange={(date) => {
            const dateStr = date ? format(date, "yyyy-MM-dd") : "";
            handleChange({ target: { name: 'date', value: dateStr } } as any);
          }}
        />
      </div>
      <div>
        <SearchableSelect
          label="Kategori Surat"
          // name="category_id"
          value={formData.category_id}
          onChange={(val) => handleChange({ target: { name: 'category_id', value: val } } as any)}
          placeholder="Pilih kategori"
          options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
        />
      </div>
      <div className="col-span-2">
        <Input
          label="Nomor Surat"
          name="number"
          value={formData.number}
          onChange={handleNumberChange}
          placeholder="Contoh: SK-001/IX/2025"
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

