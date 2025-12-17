"use client";

import { useState, useEffect } from "react";
import {
  detailIncomingMail,
  getMailCategories as getIncomingCategories,
} from "@/lib/api/mails/incoming";
import {
  detailOutgoingMail,
  getMailCategories as getOutgoingCategories,
} from "@/lib/api/mails/outgoing";
import { detailDecisionMail, getMailCategories as getDecisionCategories } from "@/lib/api/mails/decision";
import { getDivisionList } from "@/lib/api/manage/division";

type MailCategory = any;
type MailDetail = any;
type Division = any;

interface UseMailPageDataOptions {
  mailIdSessionKey: string;
  mailType: "incoming" | "outgoing" | "decision";
  fetchDivisions?: boolean;
  fetchRole?: boolean;
  redirectUrl?: string;
}

export function useMailPageData({
  mailIdSessionKey,
  mailType,
  fetchDivisions = false,
  fetchRole = false,
  redirectUrl = "/workspace/mail/incoming",
}: UseMailPageDataOptions) {
  const [categories, setCategories] = useState<MailCategory[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [mail, setMail] = useState<MailDetail | null>(null);
  const [roleId, setRoleId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mailId = sessionStorage.getItem(mailIdSessionKey);

    if (fetchRole) {
      const roleIdStr = sessionStorage.getItem("roleId");
      setRoleId(roleIdStr ? Number(roleIdStr) : null);
    }

    if (!mailId) {
      alert("No mail selected. Redirecting...");
      window.location.href = redirectUrl;
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const apiMap: Record<string, any> = {
          incoming: {
            detail: detailIncomingMail,
            categories: getIncomingCategories,
          },
          outgoing: {
            detail: detailOutgoingMail,
            categories: getOutgoingCategories,
          },
          decision: {
            detail: detailDecisionMail,
            categories: getDecisionCategories,
          },
        };

        const api = apiMap[mailType];

        const basePromises = [
          api.categories(),
          api.detail(Number(mailId)),
        ];

        if (fetchDivisions) {
          basePromises.push(getDivisionList());
        }

        const [categoriesRes, mailRes, divisionsRes] = await Promise.all(basePromises);

        setCategories(categoriesRes.data?.data || []);
        setMail(mailRes.data?.data || null);

        if (divisionsRes) {
          setDivisions(divisionsRes.data?.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch mail data:", error);
        alert("Unable to load the mail details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [mailIdSessionKey, mailType, fetchDivisions, fetchRole, redirectUrl]);

  return { categories, divisions, mail, roleId, isLoading };
}
