import DivisionTable from "@/components/features/manage/divisions/division-table";
import { Suspense } from "react";

export default function DivisionPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DivisionTable />
        </Suspense>
    );
}
