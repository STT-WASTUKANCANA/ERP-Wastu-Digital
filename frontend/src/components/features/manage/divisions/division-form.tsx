"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DivisionFormData } from "@/types/features/division";
import { User } from "@/types/features/user";
import { createDivision, updateDivision, getDivision } from "@/lib/api/manage/division";
import { getUserList } from "@/lib/api/manage/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { BiLoaderAlt } from "react-icons/bi";
import { FormWrapper } from "@/components/ui/form-wrapper";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextareaField } from "@/components/ui/textarea-field";
import { showToast, showSuccessDialog, showAlert } from "@/lib/sweetalert";

interface DivisionFormProps {
    id?: string;
}

export default function DivisionForm({ id }: DivisionFormProps) {
    const router = useRouter();
    const isEdit = !!id;
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEdit);
    const [users, setUsers] = useState<{ label: string; value: string }[]>([]);

    const [formData, setFormData] = useState<DivisionFormData>({
        name: "",
        description: "",
        leader_id: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Users for Leader dropdown
                const usersRes = await getUserList();
                if (usersRes?.ok && usersRes?.data?.data) {
                    const userOptions = usersRes.data.data.map((u: User) => ({
                        label: u.name,
                        value: u.id.toString(),
                    }));
                    setUsers(userOptions);
                }

                if (isEdit) {
                    const res = await getDivision(id!);
                    if (res?.ok) {
                        const division = res.data.data;
                        setFormData({
                            name: division.name,
                            description: division.description || "",
                            leader_id: division.leader_id?.toString() || "",
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                showAlert("error", "Gagal Memuat Data", "Terjadi kesalahan saat memuat data divisi.");
            } finally {
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
                ? await updateDivision(id!, formData)
                : await createDivision(formData);

            if (res?.ok) {
                await showSuccessDialog("Berhasil", `Divisi berhasil ${isEdit ? "diupdate" : "dibuat"}`);
                router.push("/workspace/manage/division");
            } else {
                if (res?.status === 422 && res?.data?.errors) {
                    setErrors(res.data.errors);
                } else {
                    showToast("error", res?.data?.message || "Terjadi kesalahan");
                }
            }
        } catch (error) {
            showToast("error", "Gagal menyimpan data");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <div className="flex justify-center p-8"><BiLoaderAlt className="animate-spin" /></div>;
    }

    return (
        <FormWrapper onSubmit={handleSubmit}>
            <div className="col-span-full lg:col-span-1 w-full">
                <Input
                    label="Nama Divisi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Divisi Keuangan"
                    required
                    error={errors.name?.[0]}
                />
            </div>

            <div className="col-span-full lg:col-span-1 w-full">
                <Select
                    label="Kepala Bidang (Leader)"
                    options={users}
                    value={formData.leader_id.toString()}
                    onChange={(e) => setFormData({ ...formData, leader_id: e.target.value })}
                    placeholder="Pilih Kepala Bidang"
                    error={errors.leader_id?.[0]}
                />
            </div>

            <div className="col-span-full">
                <TextareaField
                    label="Deskripsi"
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Deskripsi singkat divisi"
                />
            </div>

            <div className="col-span-full">
                <SubmitButton
                    loading={loading}
                    submitText="Simpan"
                />
            </div>
        </FormWrapper>
    );
}
