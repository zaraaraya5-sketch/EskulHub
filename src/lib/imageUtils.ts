/**
 * Contextual fallback image mapper for extracurricular activities.
 * Prevents generic placeholders (or unrelated tech/laptop photos)
 * and guarantees relevant, high-resolution photography across the application.
 */

export const CATEGORY_FALLBACKS: Record<string, string> = {
  // Olahraga
  voli: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
  volly: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
  volleyball: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
  futsal: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
  football: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
  sepak: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
  basket: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  basketball: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  badminton: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800',
  bulutangkis: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800',
  silat: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800',
  pencak: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800',
  karate: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800',
  taekwondo: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800',
  bela: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800',

  // Kepemimpinan & Bela Negara
  paskibra: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5tBV8kDQOfViGAslYLp1_hJ4v-QxTURbwOSeOu9MR2HDzTgdZpWHVmyMM&s=10',
  paskib: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5tBV8kDQOfViGAslYLp1_hJ4v-QxTURbwOSeOu9MR2HDzTgdZpWHVmyMM&s=10',
  pbb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5tBV8kDQOfViGAslYLp1_hJ4v-QxTURbwOSeOu9MR2HDzTgdZpWHVmyMM&s=10',
  pramuka: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
  scout: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',

  // Kemanusiaan & Kesehatan
  pmr: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800',
  palang: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800',
  kemanusiaan: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800',
  medis: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800',

  // Keagamaan & Spiritual
  rohis: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800',
  islam: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800',
  keagamaan: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800',
  rohani: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800',

  // Bahasa & Akademik
  english: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
  inggris: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
  bahasa: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
  literasi: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
  kir: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
  sains: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
  jurnalistik: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',
  fotografi: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',

  // Seni & Kreativitas
  musik: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
  band: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
  choir: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
  paduan: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
  tari: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800',
  dance: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800',
  teater: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800',
  drama: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800',

  // Teknologi & Rekayasa
  it: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
  coding: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
  komputer: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
  robotik: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
};

const DEFAULT_GLOBAL_FALLBACK = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800';

export const getContextualFallbackImage = (identifier?: string): string => {
  if (!identifier) return DEFAULT_GLOBAL_FALLBACK;
  const clean = identifier.toLowerCase().trim();
  for (const [key, url] of Object.entries(CATEGORY_FALLBACKS)) {
    if (clean.includes(key)) {
      return url;
    }
  }
  return DEFAULT_GLOBAL_FALLBACK;
};

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  identifier?: string
) => {
  const target = e.currentTarget;
  const fb = getContextualFallbackImage(identifier || target.alt);
  if (target.src !== fb) {
    target.src = fb;
  }
};

