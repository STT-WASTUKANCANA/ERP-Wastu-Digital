"use client";

import { useState, useEffect } from 'react';
import { IncomingMail } from '@/types/mail-props';
import { getIncomingMailList } from '@/lib/api/mails/incoming';
import IncomingMailTable from '@/components/features/mails/incomingMail/incoming-mail-table';

const IncomingMailsPage = () => {
  const [mails, setMails] = useState<IncomingMail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMails = async () => {
    setIsLoading(true);
    const result = await getIncomingMailList();
    if (result.ok && result.data && Array.isArray(result.data.data)) {
      setMails(result.data.data);
    } else {
      setMails([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMails();
  }, []);

  const handleMailCreated = () => {
    fetchMails();
  };

  return (
    <IncomingMailTable
      incomingMails={mails}
      onMailCreated={handleMailCreated}
      isLoading={isLoading}
    />
  );
};

export default IncomingMailsPage;