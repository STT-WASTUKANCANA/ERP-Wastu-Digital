"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  createIncomingMail,
  reviewIncomingMail,
  updateIncomingMail,
  divisionReviewIncomingMail
} from "@/lib/api/mails/incoming";
import { getStorageUrl } from "@/lib/utils";
import { Collapse } from "@/components/ui/collapse";

interface IncomingFormProps {
  categories: any[];
  divisions: any[];
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
        division_id: initialData.division_id || "",
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

    data = new FormData();

    const isReviewProcess =
      mode === "review" || (mode === "edit" && formData.status == 2);

    const isDivisionReview = mode === "division_review";

    if (isReviewProcess) {
      data.append("division_id", formData.division_id);
      data.append("desc", formData.sekum_desc);
      data.append("_method", "PUT");
    } else if (isDivisionReview) {
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

    let actionToCall;

    if (isDivisionReview) actionToCall = actions.division_review;
    else if (isReviewProcess) actionToCall = actions.review;
    else if (mode === "edit") actionToCall = actions.edit;
    else actionToCall = actions.create;

    const res = await actionToCall?.();

    if (res.ok) {
      let message = "Surat berhasil dibuat.";
      if (isReviewProcess) message = "Surat berhasil ditinjau.";
      else if (isDivisionReview) message = "Status berhasil diperbarui.";
      else if (mode === "edit") message = "Surat berhasil dirubah.";
      alert(message);
      router.push("/workspace/mail/incoming");
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
              id="number"
              name="number"
              type="text"
              value={formData.number}
              onChange={handleChange}
              placeholder="Contoh: IM-001/STT/2025"
              disabled={
                mode === "review" ||
                mode === "division_review" ||
                (mode === "edit" && formData.status == 2)
              }
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
              disabled={
                mode === "review" ||
                mode === "division_review" ||
                (mode === "edit" && formData.status == 2)
              }
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
              disabled={
                mode === "review" ||
                mode === "division_review" ||
                (mode === "edit" && formData.status == 2)
              }
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium text-foreground">
              Deskripsi
            </label>
            <textarea
              id="desc"
              name="desc"
              rows={4}
              value={formData.desc}
              onChange={handleChange}
              placeholder="Tulis deskripsi surat..."
              className={`mt-4 block w-full rounded-md border border-gray-300 p-2 text-sm ${mode === "division_review" || mode === "review" ? "bg-accent" : "bg-background"
                  }`}
              disabled={
                mode === "review" ||
                mode === "division_review" ||
                (mode === "edit" && formData.status == 2)
              }
            />
          </div>

          {(mode === "edit" || mode === "review" || mode === "division_review") &&
            formData.attachment && (
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

          {(mode === "create" ||
            (mode === "edit" && formData.status != 2)) && (
              <div className="col-span-2">
                <FileDropzone
                  label={
                    mode === "edit"
                      ? "Upload Lampiran Baru (Opsional, akan menggantikan yang lama)"
                      : "Lampiran Surat"
                  }
                  name="attachment"
                  onFilesAccepted={(accepted) => setFiles(accepted)}
                />
              </div>
            )}

          {(mode === "create" ||
            (mode === "edit" && formData.status != 2)) && (
              <div className="col-span-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white px-4 py-2 rounded-md hover:brightness-90 transition"
                >
                  {loading
                    ? "Memproses..."
                    : mode === "edit"
                      ? "Update Surat"
                      : "Kirim Surat"}
                </Button>
              </div>
            )}
        </div>
      </div>

      {(mode === "review" ||
        mode === "division_review" ||
        (formData.status == 2 && roleId == 2)) && (
          <div className="bg-white p-8 rounded-lg shadow space-y-8 mt-4">
            {mode === "review" && (
              <div className="col-span-2">
                <Select
                  label="Bagikan ke Bagian"
                  id="division_id"
                  name="division_id"
                  onChange={handleChange}
                  value={formData.division_id}
                  placeholder="Pilih bagian"
                  options={divisions.map((division) => ({
                    value: division.id,
                    label: division.name,
                  }))}
                />
              </div>
            )}

            <div className="col-span-2">
              <label className="text-sm font-medium text-foreground">
                Catatan Sekretaris Umum
              </label>
              <textarea
                id="sekum_desc"
                name="sekum_desc"
                rows={4}
                value={formData.sekum_desc}
                onChange={handleChange}
                placeholder="Tulis catatan atau instruksi..."
                className={`mt-4 block w-full rounded-md border border-gray-300 p-2 text-sm  ${mode === "division_review" ? "bg-accent" : "bg-background"
                  }`}
                disabled={mode === "division_review"}
              />
            </div>

            {mode === "review" && (
              <div className="col-span-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white px-4 py-2 rounded-md hover:brightness-90 transition"
                >
                  {loading ? "Memproses..." : "Simpan"}
                </Button>
              </div>
            )}
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

          <div className="col-span-2">
            <label className="text-sm font-medium text-foreground">
              Deskripsi Bidang
            </label>
            <textarea
              id="division_desc"
              name="division_desc"
              rows={4}
              value={formData.division_desc}
              onChange={handleChange}
              placeholder="Tulis deskripsi..."
              className="mt-4 block w-full rounded-md border border-gray-300 p-2 text-sm"
            />
          </div>

          <div className="col-span-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white px-4 py-2 rounded-md hover:brightness-90 transition"
            >
              {loading ? "Memproses..." : "Simpan"}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
