import { fetchLatestWeekend, fetchRaceResults } from './jolpica';

// Simple in-memory cache for the MVP
export const cache = {
  latestWeekend: null as any,
  schedule: [] as any[],
  results: [] as any[],
  driverStandings: [] as any[],
  constructorStandings: [] as any[],
  lastUpdated: null as Date | null
};

export let initialSyncPromise: Promise<void>;

export const startCronJobs = () => {
  console.log('Background Cache Service initialized');
  initialSyncPromise = runSync().catch(err => {
    console.error('Unhandled error during cache startup:', err);
  });
  setInterval(() => {
    runSync().catch(err => console.error('Error during scheduled cache sync:', err));
  }, 60000);
};

export const runSync = async () => {
  console.log('Running F1 data fetch...');
  try {
    const latestWeekend = await fetchLatestWeekend();
    if (!latestWeekend) {
      console.log('No completed weekends found.');
      return;
    }

    console.log(`Latest weekend found: ${latestWeekend.name} (${latestWeekend.season} Round ${latestWeekend.round})`);
    
    // Cache weekend
    cache.latestWeekend = latestWeekend;

    // Cache schedule
    const { fetchSchedule, fetchDriverStandings, fetchConstructorStandings } = await import('./jolpica');
    const schedule = await fetchSchedule(latestWeekend.season);
    cache.schedule = schedule;

    // Fetch and cache standings independently of race results
    const [driverSt, constructorSt] = await Promise.all([
      fetchDriverStandings(latestWeekend.season),
      fetchConstructorStandings(latestWeekend.season)
    ]);
    cache.driverStandings = driverSt;
    cache.constructorStandings = constructorSt;

    // Fetch and cache results
    let results = await fetchRaceResults(latestWeekend.season, latestWeekend.round);
    
    if (results.length === 0 && latestWeekend.round > 1) {
      console.log(`No results for Round ${latestWeekend.round}, checking previous round ${latestWeekend.round - 1}...`);
      const prevResults = await fetchRaceResults(latestWeekend.season, latestWeekend.round - 1);
      if (prevResults.length > 0) {
        results = prevResults;
        const prevRace = schedule.find((r: any) => r.round === latestWeekend.round - 1);
        if (prevRace) {
          cache.latestWeekend = {
            id: `${prevRace.season}-${prevRace.round}`,
            season: prevRace.season,
            round: prevRace.round,
            name: prevRace.raceName,
            circuitId: prevRace.circuitId,
            date: prevRace.date
          };
          console.log(`Using Round ${prevRace.round} (${prevRace.raceName}) for latest results as Round ${latestWeekend.round} results are not published yet.`);
        }
      }
    }

    if (results.length > 0) {
      console.log(`Fetched ${results.length} results for the race.`);
      
      cache.results = results.map((result: any) => ({
        weekendId: cache.latestWeekend.id,
        position: parseInt(result.position, 10),
        points: parseFloat(result.points),
        driver: {
          id: result.Driver.driverId,
          code: result.Driver.code,
          firstName: result.Driver.givenName,
          lastName: result.Driver.familyName,
        },
        team: {
          id: result.Constructor.constructorId,
          name: result.Constructor.name
        },
        laps: parseInt(result.laps, 10),
        status: result.status,
        fastestLap: result.FastestLap ? {
          rank: parseInt(result.FastestLap.rank, 10),
          lap: parseInt(result.FastestLap.lap, 10),
          time: result.FastestLap.Time?.time || '',
          averageSpeed: result.FastestLap.AverageSpeed?.speed || ''
        } : null
      }));
    } else {
      cache.results = [];
    }

    cache.lastUpdated = new Date();
    console.log('Successfully cached results and standings in memory.');
  } catch (error) {
    console.error('Error in cache job:', error);
  }
};
