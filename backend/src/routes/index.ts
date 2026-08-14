import { Application, Request, Response } from 'express';
import { cache, runSync, initialSyncPromise } from '../services/syncService';

export const initRoutes = (app: Application) => {
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'F1 Insight API is running' });
  });

  app.get('/api/latest-weekend', async (req: Request, res: Response) => {
    await initialSyncPromise;
    if (!cache.latestWeekend) {
      return res.status(404).json({ error: 'Data not loaded yet' });
    }
    res.json(cache.latestWeekend);
  });

  app.get('/api/latest-results', async (req: Request, res: Response) => {
    await initialSyncPromise;
    res.json(cache.results);
  });

  app.get('/api/driver-standings', async (req: Request, res: Response) => {
    await initialSyncPromise;
    res.json(cache.driverStandings);
  });

  app.get('/api/schedule', async (req: Request, res: Response) => {
    await initialSyncPromise;
    res.json(cache.schedule);
  });

  app.get('/api/results/:round', async (req: Request, res: Response) => {
    await initialSyncPromise;
    const round = parseInt(req.params.round as string, 10);
    // Since we don't cache all rounds, fetch on demand
    const { fetchRaceResults } = await import('../services/jolpica');
    const currentYear = new Date().getFullYear();
    const results = await fetchRaceResults(currentYear, round);
    res.json(results);
  });

  app.get('/api/next-race', async (req: Request, res: Response) => {
    await initialSyncPromise;
    const now = new Date();
    const next = cache.schedule.find(r => {
      const raceDate = new Date(`${r.date}T${r.time || '00:00:00Z'}`);
      return raceDate >= now;
    });
    res.json(next || null);
  });

  app.get('/api/weather', async (req: Request, res: Response) => {
    try {
      const { lat, long } = req.query;
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) {
        return res.json({ error: 'OPENWEATHER_API_KEY not configured', mock: true, text: 'Sunny', tempMax: 25 });
      }

      const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`);
      const weatherData = await weatherRes.json();

      if (!weatherRes.ok) {
        console.warn("OpenWeather API Error:", weatherData);
        return res.json({ error: weatherData.message || 'OpenWeather API Error', mock: true, text: 'Sunny', tempMax: 25 });
      }

      res.json({
        text: weatherData.weather?.[0]?.main || 'Clear',
        tempMax: weatherData.main?.temp_max,
        tempMin: weatherData.main?.temp_min,
        unit: 'C',
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch OpenWeather data' });
    }
  });

  app.get('/api/session-key', async (req: Request, res: Response) => {
    try {
      const country = req.query.country as string;
      const year = req.query.year as string;
      const response = await fetch(`https://api.openf1.org/v1/sessions?country_name=${country}&year=${year}&session_name=Race`);
      const data = await response.json();
      res.json(data[0] || null);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch session' });
    }
  });

  app.get('/api/constructor-standings', async (req: Request, res: Response) => {
    await initialSyncPromise;
    res.json(cache.constructorStandings);
  });

  app.get('/api/telemetry', async (req: Request, res: Response) => {
    try {
      const { driver_number, session_key } = req.query;
      if (!driver_number || !session_key) {
        return res.status(400).json({ error: 'Missing driver_number or session_key' });
      }
      
      const response = await fetch(`https://api.openf1.org/v1/car_data?driver_number=${driver_number}&session_key=${session_key}&speed>=315`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch telemetry' });
    }
  });

  app.get('/api/circuit-info/:circuitId', async (req: Request, res: Response) => {
    try {
      const circuitId = req.params.circuitId;
      const response = await fetch(`https://api.jolpi.ca/ergast/f1/circuits/${circuitId}/results/1.json?limit=100`);
      const data = await response.json();
      const races = data.MRData?.RaceTable?.Races || [];

      const pastWinners = races.slice(-3).reverse().map((r: any) => ({
        year: r.season,
        driver: r.Results[0].Driver.familyName,
        team: r.Results[0].Constructor.name
      }));

      const lastRace = races[races.length - 1];
      const laps = lastRace ? lastRace.Results[0].laps : null;

      res.json({ laps, pastWinners });
    } catch (error) {
      console.error('Error fetching circuit info:', error);
      res.status(500).json({ error: 'Failed to fetch circuit info' });
    }
  });

  app.post('/api/force-sync', async (req: Request, res: Response) => {
    await runSync();
    res.json({ success: true, lastUpdated: cache.lastUpdated });
  });
};
