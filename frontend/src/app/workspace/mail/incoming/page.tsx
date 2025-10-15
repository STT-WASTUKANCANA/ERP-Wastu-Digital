
import IncomingMailTable from '@/components/features/mails/incomingMail/incoming-mail-table';
import { getIncomingMailList } from '@/lib/api/mails/incoming';

const Page = async () => {
  const { ok, data } = await getIncomingMailList();
  const incomingMails = ok ? data.data : [];

  return (
    <IncomingMailTable incomingMails={incomingMails} />
  );
};

export default Page;