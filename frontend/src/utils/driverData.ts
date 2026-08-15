/**
 * Driver headshot image mapping using the official F1 media CDN.
 * This replaces the unreliable OpenF1 API which requires auth during live sessions.
 * 
 * URL Pattern:
 * https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/{LETTER}/{CODE}_{First}_{Last}/{code}.png.transform/1col/image.png
 */

interface DriverImageEntry {
  code: string;     // F1 media CDN code e.g. "MAXVER01"
  firstName: string; // First name as used in CDN path
  lastName: string;  // Last name as used in CDN path
  number: number;    // Current 2026 car number
  team: string;      // Team identifier for the image path
}

const DRIVER_DATA: Record<string, DriverImageEntry> = {
  'norris':          { code: 'LANNOR01', firstName: 'Lando', lastName: 'Norris', number: 1, team: 'mclaren' },
  'max_verstappen':  { code: 'MAXVER01', firstName: 'Max', lastName: 'Verstappen', number: 3, team: 'redbullracing' },
  'leclerc':         { code: 'CHALEC01', firstName: 'Charles', lastName: 'Leclerc', number: 16, team: 'ferrari' },
  'hamilton':        { code: 'LEWHAM01', firstName: 'Lewis', lastName: 'Hamilton', number: 44, team: 'ferrari' },
  'russell':         { code: 'GEORUS01', firstName: 'George', lastName: 'Russell', number: 63, team: 'mercedes' },
  'piastri':         { code: 'OSCPIA01', firstName: 'Oscar', lastName: 'Piastri', number: 81, team: 'mclaren' },
  'sainz':           { code: 'CARSAI01', firstName: 'Carlos', lastName: 'Sainz', number: 55, team: 'williams' },
  'alonso':          { code: 'FERALO01', firstName: 'Fernando', lastName: 'Alonso', number: 14, team: 'astonmartin' },
  'stroll':          { code: 'LANSTR01', firstName: 'Lance', lastName: 'Stroll', number: 18, team: 'astonmartin' },
  'gasly':           { code: 'PIEGAS01', firstName: 'Pierre', lastName: 'Gasly', number: 10, team: 'alpine' },
  'ocon':            { code: 'ESTOCO01', firstName: 'Esteban', lastName: 'Ocon', number: 31, team: 'haasf1team' },
  'albon':           { code: 'ALEALB01', firstName: 'Alexander', lastName: 'Albon', number: 23, team: 'williams' },
  'hulkenberg':      { code: 'NICHUL01', firstName: 'Nico', lastName: 'Hulkenberg', number: 27, team: 'audi' },
  'bottas':          { code: 'VALBOT01', firstName: 'Valtteri', lastName: 'Bottas', number: 77, team: 'cadillac' },
  'perez':           { code: 'SERPER01', firstName: 'Sergio', lastName: 'Perez', number: 11, team: 'cadillac' },
  'lawson':          { code: 'LIALAW01', firstName: 'Liam', lastName: 'Lawson', number: 30, team: 'racingbulls' },
  'antonelli':       { code: 'ANDANT01', firstName: 'Andrea Kimi', lastName: 'Antonelli', number: 12, team: 'mercedes' },
  'bearman':         { code: 'OLIBEA01', firstName: 'Oliver', lastName: 'Bearman', number: 87, team: 'haasf1team' },
  'colapinto':       { code: 'FRACOL01', firstName: 'Franco', lastName: 'Colapinto', number: 43, team: 'alpine' },
  'bortoleto':       { code: 'GABBOR01', firstName: 'Gabriel', lastName: 'Bortoleto', number: 5, team: 'audi' },
  'hadjar':          { code: 'ISAHAD01', firstName: 'Isack', lastName: 'Hadjar', number: 6, team: 'redbullracing' },
  'lindblad':        { code: 'ARVLIN01', firstName: 'Arvid', lastName: 'Lindblad', number: 41, team: 'racingbulls' },
};

const F1_MEDIA_BASE = 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026';

function normalizeId(driverId: string): string {
  if (!driverId) return '';
  const clean = driverId.toLowerCase().replace(/_/g, '').replace(/-/g, '');
  if (clean.includes('lindblad')) return 'lindblad';
  if (clean.includes('antonelli')) return 'antonelli';
  if (clean.includes('bearman')) return 'bearman';
  if (clean.includes('colapinto')) return 'colapinto';
  if (clean.includes('bortoleto')) return 'bortoleto';
  if (clean.includes('hadjar')) return 'hadjar';
  if (clean.includes('lawson')) return 'lawson';
  if (clean.includes('verstappen')) return 'max_verstappen';
  return driverId;
}

/**
 * Get the official F1 headshot image URL for a driver.
 * Returns null if the driverId is not in the mapping.
 */
export function getDriverImageUrl(driverId: string): string | null {
  const normId = normalizeId(driverId);
  const entry = DRIVER_DATA[normId];
  if (!entry) return null;
  const team = entry.team;
  const code = entry.code.toLowerCase();
  return `${F1_MEDIA_BASE}/${team}/${code}/2026${team}${code}right.webp`;
}

/**
 * Get the current 2026 car number for a driver.
 * Returns null if the driverId is not in the mapping.
 */
export function getDriverNumber(driverId: string): number | null {
  const normId = normalizeId(driverId);
  return DRIVER_DATA[normId]?.number ?? null;
}

/**
 * Get both image URL and number for a driver. Convenience method.
 */
export function getDriverInfo(driverId: string): { imageUrl: string | null; number: number | null } {
  return {
    imageUrl: getDriverImageUrl(driverId),
    number: getDriverNumber(driverId),
  };
}
