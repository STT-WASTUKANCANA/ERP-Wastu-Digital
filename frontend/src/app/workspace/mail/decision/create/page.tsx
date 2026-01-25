import { FiCornerDownLeft } from "react-icons/fi";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { getMailCategories } from "@/lib/api/mails/decision";
import DecisionForm from "@/components/features/mails/decision-mail/decision-form";

export default async function Page() {
        const res = await getMailCategories();
        const categories = res.data?.data ?? [];

        return (
                <div className="space-y-8 lg:px-24 xl:px-56">
                        <PageHeader
                                title="Buat Surat Keputusan"
                                description="Lengkapi formulir berikut untuk menambah data surat keputusan baru."
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

                        <DecisionForm categories={categories} mode="create" />
                </div>
        );
}
