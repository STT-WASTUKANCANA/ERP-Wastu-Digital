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
} from "@/lib/api/mails/incoming";
import { getStorageUrl } from "@/lib/utils";
import { Collapse } from "@/components/ui/collapse";

interface IncomingFormProps {
  categories: any[];
  divisions: any[];
  initialData?: any;
  mode?: "create" | "edit" | "review";
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
    review_notes: "",
  });

  useEffect(() => {
    if (initialData) {
      const reviewLog = initialData.mail_log?.find(
        (log: any) => log.status === 2
      );

      setFormData({
        number: initialData.number || "",
        category_id: initialData.category_id || "",
        date: initialData.date ? initialData.date.split(" ")[0] : "",
        desc: initialData.desc || "",
        attachment: initialData.attachment || "",
        status: initialData.status || 0,
        division_id: initialData.division_id || "",
        review_notes: reviewLog?.desc || "",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();

    const isReviewProcess =
      mode === "review" || (mode === "edit" && formData.status == 2);

    if (isReviewProcess) {
      data.append("division_id", formData.division_id);
      data.append("desc", formData.review_notes);
      data.append("_method", "PUT");
    } else {
      const { attachment, division_id, review_notes, ...restFormData } =
        formData;
      Object.entries(restFormData).forEach(([key, value]) =>
        data.append(key, String(value))
      );

      if (files.length > 0) {
        data.append("attachment", files[0]);
      }

      if (mode === "edit") {
        data.append("_method", "PUT");
      }
    }

    const actions = {
      create: () => createIncomingMail(data),
      edit: () => updateIncomingMail(data, initialData.id),
      review: () => reviewIncomingMail(data, initialData.id),
    };

    let actionToCall;
    if (isReviewProcess) {
      actionToCall = actions.review;
    } else if (mode === "edit") {
      actionToCall = actions.edit;
    } else {
      actionToCall = actions.create;
    }

    const res = await (actionToCall?.() ?? Promise.resolve(null));

    if (res.ok) {
      let message = "Successfully created mail.";
      if (isReviewProcess) {
        message = "Successfully reviewed mail.";
      } else if (mode === "edit") {
        message = "Successfully updated mail.";
      }

      alert(message);
      router.push("/workspace/mail/incoming");
    } else {
      alert("Operation failed.");
    }

    setLoading(false);
  };

  console.log("FormData status:", formData.status, "Role ID:", roleId);
  console.log("Mode :", mode);
  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white p-8 rounded-lg shadow space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-8">
          <div className="col-span-2">
            <Input
              label="Mail Number"
              id="number"
              name="number"
              type="text"
              value={formData.number}
              onChange={handleChange}
              placeholder="Example: IM-001/STT/2025"
              disabled={mode === "review" || (mode === "edit" && formData.status == 2)}
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
              disabled={mode === "review" || (mode === "edit" && formData.status == 2)}
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
              disabled={mode === "review" || (mode === "edit" && formData.status == 2)}
            />
          </div>

          <div className="col-span-2">
            <label
              htmlFor="desc"
              className="text-sm font-medium text-foreground"
            >
              Description
            </label>
            <textarea
              id="desc"
              name="desc"
              rows={4}
              value={formData.desc}
              onChange={handleChange}
              placeholder="Write mail description..."
              className={`mt-4 block w-full rounded-md border border-gray-300 p-2 text-sm ${mode === "review" || (mode === "edit" && formData.status == 2)
                  ? "bg-accent"
                  : "bg-background"
                }`}
              disabled={mode === "review" || (mode === "edit" && formData.status == 2)}
            />
          </div>

          {((mode === "edit" || mode === "review") && formData.attachment) && (
            <div className="col-span-2">
              <Collapse title="Show Current Attachment">
                <embed
                  src={getStorageUrl(formData.attachment)}
                  type="application/pdf"
                  width="100%"
                  className="h-[400px] lg:h-[600px]"
                />
              </Collapse>
            </div>
          )}

          {(mode === "create" || (mode === "edit" && formData.status != 2)) && (
            <div className="col-span-2">
              <FileDropzone
                label={
                  mode === "edit"
                    ? "Upload New Attachment (Optional, will replace the old one)"
                    : "Attachment (File)"
                }
                name="attachment"
                onFilesAccepted={(accepted) => setFiles(accepted)}
              />
            </div>
          )}

          {(mode === "create" || (mode === "edit" && formData.status != 2)) && (
            <div className="col-span-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white px-4 py-2 rounded-md hover:brightness-90 transition"
              >
                {loading
                  ? "Submitting..."
                  : mode === "edit"
                    ? "Update Mail"
                    : "Submit"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {(mode === "review" || (formData.status == 2 && roleId == 2)) && (
        <div className="bg-white p-8 rounded-lg shadow space-y-8 mt-4">
          <div className="col-span-2">
            <Select
              label="Forward to Division"
              id="division_id"
              name="division_id"
              onChange={handleChange}
              value={formData.division_id}
              placeholder="Select Division"
              options={divisions.map((division) => ({
                value: division.id,
                label: division.name,
              }))}
            />
          </div>
          <div className="col-span-2">
            <label
              htmlFor="review_notes"
              className="text-sm font-medium text-foreground"
            >
              Review Notes / Disposition
            </label>
            <textarea
              id="review_notes"
              name="review_notes"
              rows={4}
              value={formData.review_notes}
              onChange={handleChange}
              placeholder="Write review notes or disposition details..."
              className={`mt-4 block w-full rounded-md border border-gray-300 p-2 text-sm bg-background`}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-8">
            <div className="col-span-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white px-4 py-2 rounded-md hover:brightness-90 transition"
              >
                {loading ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}