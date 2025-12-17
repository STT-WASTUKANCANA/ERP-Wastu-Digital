"use client";

import UserForm from "@/components/features/users/user-form";
import { useUserForm } from "@/hooks/features/user/useUserForm";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FiCornerDownLeft } from "react-icons/fi";

export default function CreateUserPage() {
    const router = useRouter();
    const { roles, divisions, isLoading } = useUserForm();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p>Memuat...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 lg:px-24 xl:px-56">
            <PageHeader
                title="Tambah Pengguna Baru"
                description="Isi formulir di bawah untuk menambahkan pengguna baru."
            >
                <Button
                    color="bg-background"
                    className="flex text-sm justify-center items-center gap-2 text-foreground border border-secondary/20 px-8 py-2 cursor-pointer"
                    route="back"
                >
                    <FiCornerDownLeft />
                    Kembali
                </Button>
            </PageHeader>
            <UserForm
                roles={roles}
                divisions={divisions}
                mode="create"
            />
        </div>
    );
}
