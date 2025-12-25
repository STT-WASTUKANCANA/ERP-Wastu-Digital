import { BsInbox, BsSend } from "react-icons/bs";
import { GoTable } from "react-icons/go";
import { LuMails, LuUsers } from "react-icons/lu";
import { MdOutlineAccountTree } from "react-icons/md";
import { RiMailCheckLine } from "react-icons/ri";
import { TbLayoutGrid } from "react-icons/tb";
import { VscGraphLine } from "react-icons/vsc";

export const navLinks = [
        {
                title: "Dasbor",
                links: [
                        {
                                name: "Ikhtisar",
                                href: '/workspace/overview',
                                icon: TbLayoutGrid,
                        },
                ],
        },
        {
                title: "Master",
                links: [
                        {
                                name: "Kategori Surat",
                                href: "/workspace/master/mail-category",
                                icon: LuMails,
                        },
                ],
        },
        {
                title: "Surat",
                links: [
                        {
                                name: "Surat Masuk",
                                href: "/workspace/mail/incoming",
                                icon: BsInbox,
                        },
                        {
                                name: "Surat Keluar",
                                href: "/workspace/mail/outgoing",
                                icon: BsSend,
                        },
                        {
                                name: "Surat Keputusan",
                                href: "/workspace/mail/decision",
                                icon: RiMailCheckLine,
                        },
                ],
        },
        {
                title: "Manajemen",
                links: [
                        {
                                name: "Divisi",
                                href: "/workspace/manage/division",
                                icon: MdOutlineAccountTree,
                        },
                        {
                                name: "Pengguna",
                                href: "/workspace/manage/user",
                                icon: LuUsers,
                        },
                ],
        },
        // {
        //         title: "Contoh",
        //         links: [
        //                 {
        //                         name: "Reports",
        //                         icon: VscGraphLine,
        //                         children: [
        //                                 { name: "Monthly", href: "/users" },
        //                                 { name: "Weekly", href: "/users/add" },
        //                         ],
        //                 },
        //                 {
        //                         name: "Table",
        //                         href: "/workspace/table",
        //                         icon: GoTable,
        //                 },
        //         ],
        // },
];