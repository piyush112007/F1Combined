import { getDriverImageUrl } from './driverData';

export interface DriverAvatar {
  id: string;
  name: string;
  code: string;
  number: number;
  team: string;
  teamColor: string;
  headshotUrl: string;
}

export const F1_DRIVERS: DriverAvatar[] = [
  {
    id: 'norris',
    name: 'Lando Norris',
    code: 'NOR',
    number: 1,
    team: 'McLaren',
    teamColor: '#FF8000',
    headshotUrl: getDriverImageUrl('norris') || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png',
  },
  {
    id: 'max_verstappen',
    name: 'Max Verstappen',
    code: 'VER',
    number: 3,
    team: 'Red Bull Racing',
    teamColor: '#3671C6',
    headshotUrl: getDriverImageUrl('max_verstappen') || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png',
  },
  {
    id: 'piastri',
    name: 'Oscar Piastri',
    code: 'PIA',
    number: 81,
    team: 'McLaren',
    teamColor: '#FF8000',
    headshotUrl: getDriverImageUrl('piastri') || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png',
  },
  {
    id: 'hamilton',
    name: 'Lewis Hamilton',
    code: 'HAM',
    number: 44,
    team: 'Ferrari',
    teamColor: '#E80020',
    headshotUrl: getDriverImageUrl('hamilton') || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png',
  },
  {
    id: 'leclerc',
    name: 'Charles Leclerc',
    code: 'LEC',
    number: 16,
    team: 'Ferrari',
    teamColor: '#E80020',
    headshotUrl: getDriverImageUrl('leclerc') || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png',
  },
  {
    id: 'russell',
    name: 'George Russell',
    code: 'RUS',
    number: 63,
    team: 'Mercedes',
    teamColor: '#27F4D2',
    headshotUrl: getDriverImageUrl('russell') || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png',
  },
  {
    id: 'antonelli',
    name: 'Andrea Kimi Antonelli',
    code: 'ANT',
    number: 12,
    team: 'Mercedes',
    teamColor: '#27F4D2',
    headshotUrl: getDriverImageUrl('antonelli') || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ANDANT01_Andrea%20Kimi_Antonelli/andant01.png',
  },
  {
    id: 'sainz',
    name: 'Carlos Sainz',
    code: 'SAI',
    number: 55,
    team: 'Williams',
    teamColor: '#64C4FF',
    headshotUrl: getDriverImageUrl('sainz') || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png',
  },
  {
    id: 'albon',
    name: 'Alexander Albon',
    code: 'ALB',
    number: 23,
    team: 'Williams',
    teamColor: '#64C4FF',
    headshotUrl: getDriverImageUrl('albon') || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png',
  },
  {
    id: 'alonso',
    name: 'Fernando Alonso',
    code: 'ALO',
    number: 14,
    team: 'Aston Martin',
    teamColor: '#229971',
    headshotUrl: getDriverImageUrl('alonso') || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png',
  },
  {
    id: 'stroll',
    name: 'Lance Stroll',
    code: 'STR',
    number: 18,
    team: 'Aston Martin',
    teamColor: '#229971',
    headshotUrl: getDriverImageUrl('stroll') || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png',
  },
  {
    id: 'gasly',
    name: 'Pierre Gasly',
    code: 'GAS',
    number: 10,
    team: 'Alpine',
    teamColor: '#0093CC',
    headshotUrl: getDriverImageUrl('gasly') || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png',
  },
  {
    id: 'ocon',
    name: 'Esteban Ocon',
    code: 'OCO',
    number: 31,
    team: 'Haas',
    teamColor: '#B6BABD',
    headshotUrl: getDriverImageUrl('ocon') || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png',
  },
  {
    id: 'bearman',
    name: 'Oliver Bearman',
    code: 'BEA',
    number: 87,
    team: 'Haas',
    teamColor: '#B6BABD',
    headshotUrl: getDriverImageUrl('bearman') || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png',
  },
  {
    id: 'hulkenberg',
    name: 'Nico Hulkenberg',
    code: 'HUL',
    number: 27,
    team: 'Audi',
    teamColor: '#EB4526',
    headshotUrl: getDriverImageUrl('hulkenberg') || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png',
  },
  {
    id: 'bortoleto',
    name: 'Gabriel Bortoleto',
    code: 'BOR',
    number: 5,
    team: 'Audi',
    teamColor: '#EB4526',
    headshotUrl: getDriverImageUrl('bortoleto') || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GABBOR01_Gabriel_Bortoleto/gabbor01.png',
  },
  {
    id: 'lawson',
    name: 'Liam Lawson',
    code: 'LAW',
    number: 30,
    team: 'RB',
    teamColor: '#6692FF',
    headshotUrl: getDriverImageUrl('lawson') || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png',
  },
  {
    id: 'hadjar',
    name: 'Isack Hadjar',
    code: 'HAD',
    number: 6,
    team: 'Red Bull Racing',
    teamColor: '#3671C6',
    headshotUrl: getDriverImageUrl('hadjar') || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png',
  },
  {
    id: 'perez',
    name: 'Sergio Perez',
    code: 'PER',
    number: 11,
    team: 'Cadillac',
    teamColor: '#252525',
    headshotUrl: getDriverImageUrl('perez') || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png',
  },
  {
    id: 'colapinto',
    name: 'Franco Colapinto',
    code: 'COL',
    number: 43,
    team: 'Alpine',
    teamColor: '#0093CC',
    headshotUrl: getDriverImageUrl('colapinto') || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png',
  },
  {
    id: 'bottas',
    name: 'Valtteri Bottas',
    code: 'BOT',
    number: 77,
    team: 'Cadillac',
    teamColor: '#252525',
    headshotUrl: getDriverImageUrl('bottas') || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png',
  },
  {
    id: 'lindblad',
    name: 'Arvid Lindblad',
    code: 'LIN',
    number: 41,
    team: 'RB',
    teamColor: '#6692FF',
    headshotUrl: getDriverImageUrl('lindblad') || 'https://www.formulaonehistory.com/wp-content/uploads/2025/12/Arvid-Lindblad-F1-2026.webp',
  },
];

export function getDriverById(id: string): DriverAvatar {
  if (!id) return F1_DRIVERS[0];
  const norm = id.toLowerCase().replace(/_/g, '');
  return (
    F1_DRIVERS.find(
      (d) =>
        d.id === id ||
        d.id.replace(/_/g, '') === norm ||
        d.code.toLowerCase() === norm
    ) || F1_DRIVERS[0]
  );
}

export function getDriverAvatarUrl(driver: DriverAvatar | null | undefined): string {
  if (!driver) return F1_DRIVERS[0].headshotUrl;
  return driver.headshotUrl;
}
