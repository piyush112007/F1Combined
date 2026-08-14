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
}

const DRIVER_DATA: Record<string, DriverImageEntry> = {
  'norris':          { code: 'LANNOR01', firstName: 'Lando', lastName: 'Norris', number: 1 },
  'max_verstappen':  { code: 'MAXVER01', firstName: 'Max', lastName: 'Verstappen', number: 3 },
  'leclerc':         { code: 'CHALEC01', firstName: 'Charles', lastName: 'Leclerc', number: 16 },
  'hamilton':        { code: 'LEWHAM01', firstName: 'Lewis', lastName: 'Hamilton', number: 44 },
  'russell':         { code: 'GEORUS01', firstName: 'George', lastName: 'Russell', number: 63 },
  'piastri':         { code: 'OSCPIA01', firstName: 'Oscar', lastName: 'Piastri', number: 81 },
  'sainz':           { code: 'CARSAI01', firstName: 'Carlos', lastName: 'Sainz', number: 55 },
  'alonso':          { code: 'FERALO01', firstName: 'Fernando', lastName: 'Alonso', number: 14 },
  'stroll':          { code: 'LANSTR01', firstName: 'Lance', lastName: 'Stroll', number: 18 },
  'gasly':           { code: 'PIEGAS01', firstName: 'Pierre', lastName: 'Gasly', number: 10 },
  'ocon':            { code: 'ESTOCO01', firstName: 'Esteban', lastName: 'Ocon', number: 31 },
  'albon':           { code: 'ALEALB01', firstName: 'Alexander', lastName: 'Albon', number: 23 },
  'hulkenberg':      { code: 'NICHUL01', firstName: 'Nico', lastName: 'Hulkenberg', number: 27 },
  'bottas':          { code: 'VALBOT01', firstName: 'Valtteri', lastName: 'Bottas', number: 77 },
  'perez':           { code: 'SERPER01', firstName: 'Sergio', lastName: 'Perez', number: 11 },
  'lawson':          { code: 'LIALAW01', firstName: 'Liam', lastName: 'Lawson', number: 30 },
  'antonelli':       { code: 'ANDANT01', firstName: 'Andrea Kimi', lastName: 'Antonelli', number: 12 },
  'bearman':         { code: 'OLIBEA01', firstName: 'Oliver', lastName: 'Bearman', number: 87 },
  'colapinto':       { code: 'FRACOL01', firstName: 'Franco', lastName: 'Colapinto', number: 43 },
  'bortoleto':       { code: 'GABBOR01', firstName: 'Gabriel', lastName: 'Bortoleto', number: 5 },
  'hadjar':          { code: 'ISAHAD01', firstName: 'Isack', lastName: 'Hadjar', number: 6 },
  'lindblad':        { code: 'ARVLIN01', firstName: 'Arvid', lastName: 'Lindblad', number: 41 },
};

const F1_MEDIA_BASE = 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers';

/**
 * Get the official F1 headshot image URL for a driver.
 * Returns null if the driverId is not in the mapping.
 */
export function getDriverImageUrl(driverId: string): string | null {
  const entry = DRIVER_DATA[driverId];
  if (!entry) return null;
  const firstNameEncoded = entry.firstName.replace(/ /g, '%20');
  return `${F1_MEDIA_BASE}/${entry.code[0]}/${entry.code}_${firstNameEncoded}_${entry.lastName}/${entry.code.toLowerCase()}.png`;
}

/**
 * Get the current 2026 car number for a driver.
 * Returns null if the driverId is not in the mapping.
 */
export function getDriverNumber(driverId: string): number | null {
  return DRIVER_DATA[driverId]?.number ?? null;
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
