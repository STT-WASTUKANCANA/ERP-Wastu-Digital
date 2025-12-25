import CategoryForm from "@/components/features/master/mail-category/category-form";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { FiCornerDownLeft } from "react-icons/fi";
import { HiOutlineUpload } from "react-icons/hi";

export default function CreateCategoryPage() {
    return (
        <div className="space-y-8 lg:px-24 xl:px-56">
            <PageHeader
                title="Buat Kategori Baru"
                description="Tambahkan kategori surat baru."
            >
                <Button className="text-foreground/70 text-sm cursor-pointer px-8 py-2 flex justify-center items-center gap-2 border border-secondary/20 bg-background">
                    <HiOutlineUpload />
                    <span>Export</span>
                </Button>
                <Button
                    color="bg-background"
                    className="flex text-sm justify-center items-center gap-2 text-foreground border border-secondary/20 px-8 py-2 cursor-pointer"
                    route="back"
                >
                    <FiCornerDownLeft />
                    Kembali
                </Button>
            </PageHeader>

            <CategoryForm />
        </div>
    );
}
