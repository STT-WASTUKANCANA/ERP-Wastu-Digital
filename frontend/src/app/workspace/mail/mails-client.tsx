"use client";
import { useState, useEffect, useRef } from "react";
import { OutgoingMail, IncomingMail, DecisionMail } from "@/types/mail-props";
import { getIncomingMailList } from "@/lib/api/mails/incoming";
import { getOutgoingMailList } from "@/lib/api/mails/outgoing";
import MailTable from "@/components/features/mails/mail-table";
import { usePathname } from "next/navigation";
import { getDecisionMailList } from "@/lib/api/mails/decision";

const MailsClient = () => {
        const [mails, setMails] = useState<(IncomingMail | OutgoingMail | DecisionMail)[]>([]);
        const [isLoading, setIsLoading] = useState(true);
        const effectRan = useRef(false);
        const fullpath = usePathname();

        const rawType = fullpath.split("/")[3];
        const type: "incoming" | "outgoing" | "decision" =
                rawType === "incoming" ? "incoming"
                        : rawType === "outgoing" ? "outgoing"
                                : "decision";

        const [searchQuery, setSearchQuery] = useState("");
        const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
        const [filterParams, setFilterParams] = useState<any>({});

        // Logika debounce untuk pencarian
        useEffect(() => {
                const handler = setTimeout(() => {
                        setDebouncedSearchQuery(searchQuery);
                }, 500);

                return () => {
                        clearTimeout(handler);
                };
        }, [searchQuery]);

        const fetchMails = async (search: string = "") => {
                setIsLoading(true);

                const params = { search, ...filterParams };

                let result;
                if (type === "incoming") {
                        result = await getIncomingMailList(params);
                } else if (type === "outgoing") {
                        result = await getOutgoingMailList(params);
                } else {
                        result = await getDecisionMailList(params);
                }

                if (result.ok && result.data && Array.isArray(result.data.data)) {
                        setMails(result.data.data);
                } else {
                        setMails([]);
                }

                setIsLoading(false);
        };

        useEffect(() => {
                if (effectRan.current) return;
                fetchMails();
                effectRan.current = true;
        }, []);

        // Ambil ulang data saat pencarian atau filter berubah
        useEffect(() => {
                if (effectRan.current) {
                        fetchMails(debouncedSearchQuery);
                }
        }, [debouncedSearchQuery, filterParams]);

        const handleMailCreated = () => {
                fetchMails(debouncedSearchQuery);
        };

        return (
                <MailTable
                        mails={mails}
                        onMailCreated={handleMailCreated}
                        isLoading={isLoading}
                        type={type}
                        onSearch={(q) => setSearchQuery(q)}
                        onFilterApply={(filters) => setFilterParams(filters)}
                />
        );
};

export default MailsClient;
