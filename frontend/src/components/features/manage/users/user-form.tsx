"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createUser, updateUser } from "@/lib/api/manage/users";
import { UserFormData, Role, Division, User } from "@/types/features/user";
import { FormWrapper } from "@/components/ui/form-wrapper";
import { SubmitButton } from "@/components/ui/submit-button";

interface UserFormProps {
    roles: Role[];
    divisions: Division[];
    initialData?: User | null;
    mode?: "create" | "edit";
}

export default function UserForm({
    roles,
    divisions,
    initialData,
    mode = "create",
}: UserFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<UserFormData>({
        name: "",
        email: "",
        password: "",
        role_id: null,
        division_id: null,
    });

    // Inisialisasi data form
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                email: initialData.email || "",
                password: "", // Jangan tampilkan password untuk keamanan
                role_id: initialData.role_id || null,
                division_id: initialData.division_id || null,
            });
        }
    }, [initialData]);

    // Handle perubahan input
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name.includes('_id') ? (value ? Number(value) : null) : value
        });
    };

    // Handle submit form
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Persiapkan payload - hapus password jika kosong saat edit
            const payload = { ...formData };
            if (mode === "edit" && !payload.password) {
                delete payload.password;
            }

            const res = mode === "create"
                ? await createUser(payload)
                : await updateUser(payload, initialData!.id);

            if (res.ok) {
                const message = mode === "create"
                    ? "Pengguna berhasil ditambahkan."
                    : "Pengguna berhasil diperbarui.";
                alert(message);
                router.push("/workspace/manage/user");
            } else {
                const errorMessage = res.data?.error || res.data?.message || "Operasi gagal.";
                alert(errorMessage);
            }
        } catch (error) {
            console.error("Form submission error:", error);
            alert("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormWrapper onSubmit={handleSubmit}>
            <div className="col-span-full lg:col-span-1 w-full">
                <Input
                    label="Nama Lengkap"
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: John Doe"
                    required
                />
            </div>

            <div className="col-span-full lg:col-span-1 w-full">
                <Input
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Contoh: john@example.com"
                    required
                />
            </div>

            <div className="col-span-full lg:col-span-1 w-full">
                <Select
                    label="Role"
                    id="role_id"
                    name="role_id"
                    value={formData.role_id?.toString() || ""}
                    onChange={handleChange}
                    placeholder="Pilih role"
                    options={roles.map((role) => ({
                        value: role.id,
                        label: role.name,
                    }))}
                />
            </div>

            <div className="col-span-full lg:col-span-1 w-full">
                <Select
                    label="Divisi"
                    id="division_id"
                    name="division_id"
                    value={formData.division_id?.toString() || ""}
                    onChange={handleChange}
                    placeholder="Pilih divisi"
                    options={divisions.map((division) => ({
                        value: division.id,
                        label: division.name,
                    }))}
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
