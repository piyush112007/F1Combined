import { Weekend } from 'shared';

const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

export const fetchLatestWeekend = async (): Promise<Weekend | null> => {
  try {
    const currentYear = new Date().getFullYear();
    // Fetch the current season's race schedule
    const response = await fetch(`${BASE_URL}/${currentYear}.json`);
    const data = await response.json();
    
    const races = data.MRData.RaceTable.Races;
    if (!races || races.length === 0) return null;

    // Filter races that have already happened (Date is in the past)
    const now = new Date();
    const completedRaces = races.filter((race: any) => {
      const raceDate = new Date(`${race.date}T${race.time || '00:00:00Z'}`);
      return raceDate < now;
    });

    if (completedRaces.length === 0) return null;

    const latestRace = completedRaces[completedRaces.length - 1];

    return {
      id: `${latestRace.season}-${latestRace.round}`,
      season: parseInt(latestRace.season, 10),
      round: parseInt(latestRace.round, 10),
      name: latestRace.raceName,
      circuitId: latestRace.Circuit.circuitId,
      date: latestRace.date
    };
  } catch (error) {
    console.error('Error fetching latest weekend from Jolpica:', error);
    return null;
  }
};

export const fetchRaceResults = async (season: number, round: number) => {
  try {
    const response = await fetch(`${BASE_URL}/${season}/${round}/results.json`);
    const data = await response.json();
    const results = data.MRData.RaceTable.Races[0]?.Results || [];
    return results;
  } catch (error) {
    console.error('Error fetching race results:', error);
    return [];
  }
};

export const fetchDriverStandings = async (year: number) => {
  try {
    const response = await fetch(`${BASE_URL}/${year}/driverStandings.json`);
    const data = await response.json();
    return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
  } catch (error) {
    console.error('Error fetching driver standings:', error);
    return [];
  }
};

export const fetchConstructorStandings = async (year: number) => {
  try {
    const response = await fetch(`${BASE_URL}/${year}/constructorStandings.json`);
    const data = await response.json();
    return data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
  } catch (error) {
    console.error('Error fetching constructor standings:', error);
    return [];
  }
};

export const fetchSchedule = async (year: number) => {
  try {
    const response = await fetch(`${BASE_URL}/${year}.json`);
    const data = await response.json();
    const races = data.MRData.RaceTable.Races;
    return races.map((r: any) => ({
      season: parseInt(r.season, 10),
      round: parseInt(r.round, 10),
      raceName: r.raceName,
      circuitId: r.Circuit.circuitId,
      circuitName: r.Circuit.circuitName,
      locality: r.Circuit.Location.locality,
      country: r.Circuit.Location.country,
      lat: r.Circuit.Location.lat,
      long: r.Circuit.Location.long,
      date: r.date,
      time: r.time,
      url: r.url,
      hasSprint: !!r.Sprint
    }));
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
};
