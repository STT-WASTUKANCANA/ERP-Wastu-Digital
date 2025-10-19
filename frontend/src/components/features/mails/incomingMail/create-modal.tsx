"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectOption } from "@/components/ui/select";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { createIncomingMail, getMailCategories } from "@/lib/api/mails/incoming";
import { IncomingCreateModalProps, MailCategory } from "@/types/mails/incoming-props";

type ErrorState = Record<string, string[]>;

export const IncomingCreateModal = ({ isOpen, onClose, onSuccess }: IncomingCreateModalProps) => {
  const [mailNumber, setMailNumber] = useState("");
  const [mailDate, setMailDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [attachment, setAttachment] = useState<File[]>([]);
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<ErrorState>({});

  useEffect(() => {
    if (!isOpen) return;

    const fetchCategories = async () => {
      setIsLoading(true);
      const res = await getMailCategories();
      if (res.ok && Array.isArray(res.data.data)) {
        const formattedCategories = res.data.data.map((cat: MailCategory) => ({
          value: cat.id.toString(),
          label: cat.name,
        }));
        setCategories(formattedCategories);
      }
      setIsLoading(false);
    };

    fetchCategories();
  }, [isOpen]);

  const handleSave = async () => {
    setErrors({});
    if (!mailNumber || !mailDate || !categoryId) {
      setErrors({
        form: ["Please fill in all required fields."],
      });
      return;
    }

    setIsSaving(true);
    const formData = new FormData();
    formData.append("number", mailNumber);
    formData.append("date", mailDate);
    formData.append("category_id", categoryId);
    if (attachment.length > 0) formData.append("attachment", attachment[0]);

    const result = await createIncomingMail(formData);

    if (result.ok) {
      onSuccess();
      handleClose();
    } else if (result.data?.errors) {
      setErrors(result.data.errors);
    } else {
      setErrors({
        form: ["Failed to save data. Please try again."],
      });
    }

    setIsSaving(false);
  };

  const handleClose = () => {
    setErrors({});
    setMailNumber("");
    setMailDate("");
    setCategoryId("");
    setAttachment([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Incoming Mail"
      size="xl"
      footer={
        <>
          <Button
            onClick={handleClose}
            className="bg-secondary/20 text-foreground text-sm px-4 py-2 cursor-pointer"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary text-sm text-white px-4 py-2 cursor-pointer"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </>
      }
    >
      <form className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {errors.form && (
          <div className="col-span-12 text-sm text-center text-red-600">
            {errors.form.map((msg, i) => (
              <p key={i}>{msg}</p>
            ))}
          </div>
        )}

        <div className="md:col-span-6">
          <Input
            label="Mail Number"
            id="mail-number"
            type="text"
            placeholder="Example: IM-001/RT/2025"
            value={mailNumber}
            onChange={(e) => setMailNumber(e.target.value)}
          />
          {errors.number && (
            <div className="mt-1 text-sm text-red-600">
              {errors.number.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-6">
          <Input
            label="Mail Date"
            id="mail-date"
            type="date"
            value={mailDate}
            onChange={(e) => setMailDate(e.target.value)}
          />
          {errors.date && (
            <div className="mt-1 text-sm text-red-600">
              {errors.date.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-12">
          <Select
            label="Mail Category"
            id="mail-category"
            options={categories}
            placeholder={isLoading ? "Loading..." : "Select Category"}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={isLoading}
          />
          {errors.category_id && (
            <div className="mt-1 text-sm text-red-600">
              {errors.category_id.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-12">
          <FileDropzone
            label="Attachment (File)"
            onFilesAccepted={(files) => setAttachment(files)}
          />
          {errors.attachment && (
            <div className="mt-1 text-sm text-red-600">
              {errors.attachment.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};
