"use client"; // Tanda ini wajib ada di paling atas!

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dropdown } from '@/components/ui/dropdown';
import { Input } from '@/components/ui/input';
import { HiOutlineUpload } from 'react-icons/hi';
import { TbDotsVertical } from 'react-icons/tb';
import { IncomingMail } from '@/types/mail-props';

const MailsClient = ({ initialMails }: { initialMails: IncomingMail[] }) => {
  const [toolsDropdown, setToolsDropdown] = useState(false);

  return (
    <>
      <div className="lg:flex lg:justify-between lg:items-center mb-6">
        <div className="flex justify-center lg:justify-start w-full">
          <div className="text-center lg:text-start space-y-4 lg:space-y-2 w-full lg:max-w-[1200px]">
            <h3 className="font-semibold text-lg">Incoming Mails</h3>
            <span className="text-secondary mb-0">
              Manage all incoming mails efficiently. Track, archive, and respond to each document to keep your communication workflow organized.
            </span>
          </div>
        </div>

        <div className="flex justify-center mt-4 lg:mt-0">
          <div className="flex gap-2">
            <Button className="text-foreground/70 text-sm cursor-pointer px-8 py-2 flex justify-center items-center gap-2 border border-secondary/20 bg-background">
              <HiOutlineUpload />
              <span>Export</span>
            </Button>
            <Button className="bg-primary text-background text-sm cursor-pointer px-4 py-2">
              +
            </Button>
          </div>
        </div>
      </div>

      <div className="relative w-full rounded-xl border border-secondary/20 p-4 bg-background">
        <div className="flex justify-between items-center gap-2 mb-4">
          <Input placeholder="🔍︎  Input the keyword" />
          <Button
            size=""
            className="flex justify-center items-center px-3 py-2 border border-secondary/20 gap-2"
            onClick={() => setToolsDropdown(!toolsDropdown)}
          >
            <TbDotsVertical />
          </Button>
          {toolsDropdown && (
            <Dropdown position="right-0 top-15" shadow="shadow-lg">
            </Dropdown>
          )}
        </div>

        <table className=" min-w-full border border-secondary/20 rounded-lg text-[12px]">
          <thead className="border-b border-secondary/20 bg-accent">
            <tr>
              <th className="px-4 py-3 text-left">Mail Number</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary/20 text-foreground">
            {/* Loop data dari props untuk menampilkan isi tabel */}
            {initialMails.length > 0 ? (
              initialMails.map((mail, index) => (
                <tr key={index} className="hover:bg-muted transition">
                  {/* Pastikan nama properti (mail.mail_number) sesuai dengan data API */}
                  <td className="px-4 py-2">{mail.number}</td> 
                  <td className="px-4 py-2">{mail.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center px-4 py-4">No mails found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MailsClient;