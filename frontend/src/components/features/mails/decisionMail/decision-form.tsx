"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { Input } from "@/components/ui/input";
import { getStorageUrl } from "@/lib/utils";
import { Collapse } from "@/components/ui/collapse";
import { createDecisionMail, updateDecisionMail } from "@/lib/api/mails/decision";
import { Select } from "@/components/ui/select";

interface DecisionFormProps {
  categories: any[];
  divisions: any[];
  initialData?: any;
  mode?: "create" | "edit";
  roleId?: number;
}

export default function DecisionForm({
  categories,
  divisions = [],
  initialData,
  mode = "create",
}: DecisionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

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
    const { attachment, ...rest } = formData;
    Object.entries(rest).forEach(([key, value]) => data.append(key, String(value)));
    if (files.length > 0) data.append("attachment", files[0]);
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
    <form onSubmit={handleSubmit}>
      <div className="bg-white p-8 rounded-lg shadow space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-8">
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
          <div className="col-span-2">
            <label className="text-sm font-medium text-foreground">Deskripsi</label>
            <textarea
              name="desc"
              rows={4}
              value={formData.desc}
              onChange={handleChange}
              placeholder="Isi deskripsi surat keputusan..."
              className="mt-2 block w-full rounded-md border border-gray-300 p-2 text-sm"
            />
          </div>
          {mode === "edit" && formData.attachment && (
            <div className="col-span-2">
              <Collapse title="Tampilkan Surat">
                <embed
                  src={getStorageUrl(formData.attachment)}
                  type="application/pdf"
                  width="100%"
                  className="h-[400px] lg:h-[600px]"
                />
              </Collapse>
            </div>
          )}
          <div className="col-span-2">
            <FileDropzone
              label={mode === "edit" ? "Upload Lampiran Baru (Opsional)" : "Lampiran (PDF)"}
              name="attachment"
              onFilesAccepted={(accepted) => setFiles(accepted)}
            />
          </div>
          <div className="col-span-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white px-4 py-2 rounded-md hover:brightness-90 transition"
            >
              {loading ? "Memproses..." : mode === "edit" ? "Update Surat" : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
