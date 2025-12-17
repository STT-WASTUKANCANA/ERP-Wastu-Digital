import DivisionForm from "@/components/features/master/divisions/division-form";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { FiCornerDownLeft } from "react-icons/fi";

export default function CreateDivisionPage() {
    return (
        <div className="space-y-8 lg:px-24 xl:px-56">
            <PageHeader
                title="Tambah Divisi Baru"
                description="Isi formulir berikut untuk menambahkan divisi baru."
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
            <DivisionForm />
        </div>
    );
}
