"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MailCategoryFormData, createMailCategory, updateMailCategory, getMailCategory } from "@/lib/api/master/mail-category";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { BiLoaderAlt } from "react-icons/bi";
import { FormWrapper } from "@/components/ui/form-wrapper";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextareaField } from "@/components/ui/textarea-field";

interface CategoryFormProps {
    id?: string;
}

export default function CategoryForm({ id }: CategoryFormProps) {
    const router = useRouter();
    const isEdit = !!id;
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEdit);

    const [formData, setFormData] = useState<MailCategoryFormData>({
        name: "",
        type: "",
        description: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    const typeOptions = [
        { label: "Surat Masuk", value: "1" },
        { label: "Surat Keluar", value: "2" },
        { label: "Surat Keputusan", value: "3" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            if (isEdit) {
                try {
                    const res = await getMailCategory(id!);
                    if (res?.ok) {
                        const data = res.data.data;
                        setFormData({
                            name: data.name,
                            type: data.type.toString(),
                            description: data.description || "",
                        });
                    }
                } catch (error) {
                    alert("Gagal memuat data");
                } finally {
                    setInitialLoading(false);
                }
            } else {
                setInitialLoading(false);
            }
        };

        fetchData();
    }, [id, isEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const res = isEdit
                ? await updateMailCategory(id!, formData)
                : await createMailCategory(formData);

            if (res?.ok) {
                alert(`Kategori berhasil ${isEdit ? "diupdate" : "dibuat"}`);
                router.push("/workspace/master/mail-category");
            } else {
                if (res?.status === 422 && res?.data?.errors) {
                    setErrors(res.data.errors);
                } else {
                    alert(res?.data?.message || "Terjadi kesalahan");
                }
            }
        } catch (error) {
            alert("Gagal menyimpan data");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <div className="flex justify-center p-8"><BiLoaderAlt className="animate-spin" /></div>;
    }

    return (
        <FormWrapper onSubmit={handleSubmit}>
            <div className="col-span-1">
                <Input
                    label="Nama Kategori"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Undangan Rapat"
                    required
                    error={errors.name?.[0]}
                />
            </div>

            <div className="col-span-1">
                <Select
                    label="Jenis Surat"
                    options={typeOptions}
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="Pilih Jenis Surat"
                    error={errors.type?.[0]}
                />
            </div>

            <div className="col-span-2">
                <TextareaField
                    label="Deskripsi"
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Deskripsi singkat kategori"
                />
            </div>

            <div className="col-span-2">
                <SubmitButton
                    loading={loading}
                    submitText={isEdit ? "Simpan Perubahan" : "Buat Kategori"}
                />
            </div>
        </FormWrapper>
    );
}
