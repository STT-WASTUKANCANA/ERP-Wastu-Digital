"use client";

import { useState, useEffect, MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Dropdown } from '@/components/ui/dropdown';
import { Input } from '@/components/ui/input';
import { HiOutlineUpload } from 'react-icons/hi';
import { TbColumns2, TbDotsVertical } from 'react-icons/tb';
import { FiDownload, FiEdit, FiTrash2 } from 'react-icons/fi';
import { IncomingMail } from '@/types/mail-props';
import { OffcanvasDetail } from '../shared/OffcanvasDetail';
import { IoChevronDown } from 'react-icons/io5';
import { GoFilter } from 'react-icons/go';

const IncomingMailTable = ({ incomingMails }: { incomingMails: IncomingMail[] }) => {
  const [toolsDropdown, setToolsDropdown] = useState(false);
  const [selectedMail, setSelectedMail] = useState<IncomingMail | null>(null);

  const handleRowClick = (mail: IncomingMail) => {
    if (window.innerWidth < 1024) {
      setSelectedMail(mail);
    }
  };

  const handleCloseOffcanvas = () => {
    setSelectedMail(null);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseOffcanvas();
      }
    };

    if (selectedMail) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedMail]);

  const handleActionClick = (e: MouseEvent, action: string, mailId: string) => {
    e.stopPropagation();
    console.log(`${action} clicked for mail ID: ${mailId}`);
  };

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

      <div className="relative w-full rounded-xl border border-secondary/20 p-4 lg:p-8 bg-background">
        <div className="flex justify-between items-center gap-2 mb-4 flex-row lg:flex-row-reverse">
          <div className="flex items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
            <Input
              placeholder="🔍︎  Input the keyword"
              className="w-[80%] sm:w-[250px] lg:w-[300px]"
            />
            <div className="hidden lg:flex items-center gap-2 text-sm">
              <div className="relative">
                <select
                  id="entries"
                  className="appearance-none bg-background border border-secondary/20 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <IoChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-secondary" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end lg:justify-start">
            <Button className="text-foreground/70 text-sm cursor-pointer px-4 py-2 flex justify-center items-center gap-2 border border-secondary/20 bg-background">
              <GoFilter />
              <span>Filter</span>
            </Button>
            <Button className="text-foreground/70 text-sm cursor-pointer px-4 py-2 flex justify-center items-center gap-2 border border-secondary/20 bg-background">
              <TbColumns2 />
              <span>Modify Column</span>
            </Button>
            <Button
              size=""
              className="flex justify-center items-center px-3 py-2 border border-secondary/20 gap-2 lg:hidden"
              onClick={() => setToolsDropdown(!toolsDropdown)}
            >
              <TbDotsVertical />
            </Button>
            {toolsDropdown && (
              <Dropdown position="right-0 top-15" shadow="shadow-lg">
              </Dropdown>
            )}
          </div>
        </div>


        <div className="overflow-x-auto">
          <table className="min-w-full border border-secondary/20 rounded-lg text-[12px]">
            <thead className="border-b border-secondary/20 bg-accent">
              <tr>
                <th className="px-4 py-3 text-left">Mail Number</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="hidden lg:table-cell px-4 py-3 text-left">Category</th>
                <th className="hidden lg:table-cell px-4 py-3 text-left">User</th>
                <th className="hidden lg:table-cell px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/20 text-foreground">
              {incomingMails.length > 0 ? (
                incomingMails.map((mail) => (
                  <tr
                    key={mail.id}
                    className="hover:bg-muted transition cursor-pointer lg:cursor-default"
                    onClick={() => handleRowClick(mail)}
                  >
                    <td className="px-4 py-3">{mail.number}</td>
                    <td className="px-4 py-3">{mail.date}</td>
                    <td className="hidden lg:table-cell px-4 py-3">{mail.category_name}</td>
                    <td className="hidden lg:table-cell px-4 py-3">{mail.user_name || '-'}</td>
                    <td className="hidden lg:table-cell px-4 py-3">
                      <div className="flex justify-start items-center gap-2">
                        <Button
                          rounded="rounded-md"
                          onClick={(e) => handleActionClick(e, 'Download', mail.id)}
                          className="p-2 bg-background hover:bg-muted border border-secondary/20"
                        >
                          <FiDownload className="w-3.5 h-3.5 text-foreground/80" />
                        </Button>
                        <Button
                          rounded="rounded-md"
                          onClick={(e) => handleActionClick(e, 'Edit', mail.id)}
                          className="p-2 bg-background hover:bg-muted border border-secondary/20"
                        >
                          <FiEdit className="w-3.5 h-3.5 text-primary" />
                        </Button>
                        <Button
                          rounded="rounded-md"
                          onClick={(e) => handleActionClick(e, 'Delete', mail.id)}
                          className="p-2 bg-background hover:bg-muted border border-secondary/20"
                        >
                          <FiTrash2 className="w-3.5 h-3.5 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center px-4 py-4">No mails found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMail && (
        <OffcanvasDetail
          mail={selectedMail}
          onClose={handleCloseOffcanvas}
        />
      )}
    </>
  );
};

export default IncomingMailTable;