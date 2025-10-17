const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL;

export function getStorageUrl(filePath: string | null | undefined): string {
  if (!STORAGE_URL) {
    console.error("NEXT_PUBLIC_STORAGE_URL is not defined in .env.local");
    return '';
  }

  if (!filePath) {
    return '';
  }

  const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;

  return `${STORAGE_URL}/${cleanPath}`;
}