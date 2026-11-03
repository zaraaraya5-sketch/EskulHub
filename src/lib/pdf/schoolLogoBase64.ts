/**
 * Dynamic logo base64 loader with in-memory caching.
 * Fetches lightweight PNGs on demand when generating official PDFs
 * rather than bloating the main application JavaScript bundle with raw base64.
 */
const logoCache = new Map<string, string>();

export async function getLogoBase64(path: string): Promise<string> {
  if (typeof window === 'undefined') return '';
  if (logoCache.has(path)) {
    return logoCache.get(path)!;
  }
  try {
    const res = await fetch(path);
    if (!res.ok) return '';
    const blob = await res.blob();
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string) || '';
        if (base64) logoCache.set(path, base64);
        resolve(base64);
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn(`Failed to load logo from ${path}:`, err);
    return '';
  }
}

export async function getSchoolLogos(): Promise<{ schoolLogo: string; kujangLogo: string }> {
  const [schoolLogo, kujangLogo] = await Promise.all([
    getLogoBase64('/images/logo-smkn1ciomas.png'),
    getLogoBase64('/images/logo-tugu-kujang.png'),
  ]);
  return { schoolLogo, kujangLogo };
}
