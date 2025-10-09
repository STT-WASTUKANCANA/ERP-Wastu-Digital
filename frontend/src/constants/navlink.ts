import { BsGrid1X2, BsInbox, BsSend } from "react-icons/bs";
import { GoTable } from "react-icons/go";
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { VscGraphLine } from "react-icons/vsc";

export const navLinks = [
        {
                title: "Dashboard",
                links: [
                        {
                                name: "Overview",
                                href: '/workspace/overview',
                                icon: BsGrid1X2,
                        },
                ],
        },
        {
                title: "Mail",
                links: [
                        {
                                name: "Incoming Mail",
                                href: "/workspace/mail/incoming",
                                icon: BsInbox,
                        },
                        {
                                name: "Outgoing Mail",
                                href: "/workspace/mail/outgoing",
                                icon: BsSend,
                        },
                ],
        },
        {
                title: "Contoh",
                links: [
                        {
                                name: "Reports",
                                icon: VscGraphLine,
                                children: [
                                        { name: "Monthly", href: "/users" },
                                        { name: "Weekly", href: "/users/add" },
                                ],
                        },
                        {
                                name: "Table",
                                href: "/workspace/table",
                                icon: GoTable,
                        },
                ],
        },
        {
                title: "Management",
                links: [
                        {
                                name: "Users",
                                href: "/users",
                                icon: LuUsers,
                        },
                        {
                                name: "Documents",
                                href: "/documents",
                                icon: IoDocumentTextOutline,
                        },
                ],
        },
];