"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CategoryForm from "@/components/features/master/mail-category/category-form";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { FiCornerDownLeft } from "react-icons/fi";

export default function EditCategoryPage() {
    const router = useRouter();
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        const storedId = sessionStorage.getItem("editingCategoryId");
        if (!storedId) {
            router.push("/workspace/master/mail-category");
            return;
        }
        setId(storedId);
    }, [router]);

    if (!id) return null;

    return (
        <div className="space-y-8 lg:px-24 xl:px-56">
            <PageHeader
                title="Edit Kategori"
                description="Perbarui informasi kategori surat."
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

            <CategoryForm id={id} />
        </div>
    );
}
