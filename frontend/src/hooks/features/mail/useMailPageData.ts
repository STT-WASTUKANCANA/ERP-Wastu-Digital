"use client";

import { useState, useEffect } from "react";
import {
  detailIncomingMail,
  getMailCategories,
} from "@/lib/api/mails/incoming";
import { getDivisionList } from "@/lib/api/master/division";

type MailCategory = any;
type MailDetail = any;
type Division = any;

interface UseMailPageDataOptions {
  mailIdSessionKey: string;
  fetchDivisions?: boolean;
  fetchRole?: boolean;
  redirectUrl?: string;
}

interface MailPageData {
  categories: MailCategory[];
  divisions: Division[];
  mail: MailDetail | null;
  roleId: number | null;
  isLoading: boolean;
}

export function useMailPageData({
  mailIdSessionKey,
  fetchDivisions = false,
  fetchRole = false,
  redirectUrl = "/workspace/mail/incoming",
}: UseMailPageDataOptions): MailPageData {
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
        const basePromises = [
          getMailCategories(),
          detailIncomingMail(Number(mailId)),
        ];

        if (fetchDivisions) {
          basePromises.push(getDivisionList());
        }

        const [categoriesRes, mailRes, divisionsRes] = await Promise.all(
          basePromises
        );

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
  }, [mailIdSessionKey, fetchDivisions, fetchRole, redirectUrl]);

  return { categories, divisions, mail, roleId, isLoading };
}