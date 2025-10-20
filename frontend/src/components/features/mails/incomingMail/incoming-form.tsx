"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createIncomingMail, updateIncomingMail } from "@/lib/api/mails/incoming";
import { getStorageUrl } from "@/lib/utils";
import { Collapse } from "@/components/ui/collapse";

interface IncomingFormProps {
  categories: any[];
  initialData?: any;
  mode?: "create" | "edit";
}

export default function IncomingForm({ categories, initialData, mode = "create" }: IncomingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    number: "",
    category_id: "",
    date: "",
    desc: "",
    attachment: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        number: initialData.number || "",
        category_id: initialData.category_id || "",
        date: initialData.date || "",
        desc: initialData.desc || "",
        attachment: initialData.attachment || "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    const { attachment, ...restFormData } = formData;
    Object.entries(restFormData).forEach(([key, value]) => data.append(key, String(value)));

    if (files.length > 0) {
      data.append("attachment", files[0]);
    }

    if (mode === "edit") {
      data.append("_method", "PUT");
    }

    const res =
      mode === "edit"
        ? await updateIncomingMail(data, initialData.id)
        : await createIncomingMail(data);

    if (res.ok) {
      alert(mode === "edit" ? "Successfully updated mail." : "Successfully created mail.");
      router.push("/workspace/mail/incoming");
    } else {
      alert("Operation failed.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-8">
        <div className="col-span-2">
          <Input
            label="Mail Number"
            id="number"
            name="number"
            type="text"
            value={formData.number}
            onChange={handleChange}
            placeholder="Example: IM-001/RT/2025"
          />
        </div>

        <div>
          <Select
            label="Mail Category"
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            placeholder="Select Category"
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
          />
        </div>

        <div>
          <Input
            label="Mail Date"
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="col-span-2">
          <textarea
            id="desc"
            name="desc"
            rows={4}
            value={formData.desc}
            onChange={handleChange}
            placeholder="Write mail description..."
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
          />
        </div>

        {(mode === "edit" && formData.attachment) && (
          <div className="col-span-2">
            <Collapse title="Show Current Attachment">
              <embed
                src={getStorageUrl(formData.attachment)}
                type="application/pdf"
                width="100%"
                height="600px"
              />
            </Collapse>
          </div>
        )}

        <div className="col-span-2">
          <FileDropzone
            label={mode === "edit" ? "Upload New Attachment (Optional, will replace the old one)" : "Attachment (File)"}
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
            {loading ? "Submitting..." : mode === "edit" ? "Update Mail" : "Submit"}
          </Button>
        </div>
      </div>
    </form>
  );
}
