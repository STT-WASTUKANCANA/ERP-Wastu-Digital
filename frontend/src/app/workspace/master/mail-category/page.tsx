import CategoryTable from "@/components/features/master/mail-category/category-table";
import { Suspense } from "react";

export default function MailCategoryPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CategoryTable />
        </Suspense>
    );
}
