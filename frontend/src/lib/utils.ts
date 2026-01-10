const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL;

export function getStorageUrl(filePath: string | null | undefined): string {
  if (!filePath) {
    return '';
  }

  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }

  if (!STORAGE_URL) {
    console.error("NEXT_PUBLIC_STORAGE_URL is not defined in .env.local");
    return '';
  }

  const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;

  return `${STORAGE_URL}/${cleanPath}`;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch (e) {
    return dateString;
  }
}