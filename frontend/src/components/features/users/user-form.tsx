"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createUser, updateUser } from "@/lib/api/master/users";
import { UserFormData, Role, Division, User } from "@/types/user-props";

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

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                email: initialData.email || "",
                password: "", // Don't populate password for security
                role_id: initialData.role_id || null,
                division_id: initialData.division_id || null,
            });
        }
    }, [initialData]);

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare payload - remove password if empty on edit
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
                router.push("/workspace/users");
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
        <form onSubmit={handleSubmit}>
            <div className="bg-white p-8 rounded-lg shadow space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-8">
                    <div className="col-span-1">
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

                    <div className="col-span-1">
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

                    <div>
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

                    <div>
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

                    <div className="col-span-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white px-4 py-2 rounded-md hover:brightness-90 transition"
                        >
                            {loading
                                ? "Memproses..."
                                : mode === "edit"
                                    ? "Perbarui Pengguna"
                                    : "Tambah Pengguna"}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
