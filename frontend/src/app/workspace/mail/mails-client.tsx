"use client";
import { useState, useEffect, useRef } from "react";
import { OutgoingMail, IncomingMail, DecisionMail } from "@/types/mail-props";
import { getIncomingMailList } from "@/lib/api/mails/incoming";
import { getOutgoingMailList } from "@/lib/api/mails/outgoing";
import MailTable from "@/components/features/mails/incomingMail/mail-table";
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

        const fetchMails = async () => {
                setIsLoading(true);

                let result;
                if (type === "incoming") {
                        result = await getIncomingMailList();
                } else if (type === "outgoing") {
                        result = await getOutgoingMailList();
                } else {
                        result = await getDecisionMailList();
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

        const handleMailCreated = () => {
                fetchMails();
        };

        return (
                <MailTable
                        mails={mails}
                        onMailCreated={handleMailCreated}
                        isLoading={isLoading}
                        type={type}
                />
        );
};

export default MailsClient;
