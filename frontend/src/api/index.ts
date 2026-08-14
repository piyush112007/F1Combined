import { useQuery } from '@tanstack/react-query';
import { Weekend } from 'shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const useLatestWeekend = () => {
  return useQuery<Weekend>({
    queryKey: ['latest-weekend'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/latest-weekend`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    refetchInterval: 60000, // Refetch every minute to get cached updates
  });
};

export const useLatestResults = () => {
  return useQuery<any[]>({
    queryKey: ['latest-results'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/latest-results`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    refetchInterval: 60000,
  });
};

export const useDriverStandings = () => {
  return useQuery<any[]>({
    queryKey: ['driver-standings'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/driver-standings`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    refetchInterval: 60000,
  });
};

export const useSchedule = () => {
  return useQuery<any[]>({
    queryKey: ['schedule'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/schedule`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    refetchInterval: 3600000, // 1 hour
  });
};

export const useConstructorStandings = () => {
  return useQuery<any[]>({
    queryKey: ['constructor-standings'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/constructor-standings`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    refetchInterval: 60000,
  });
};

export const useTelemetry = (driverNumber: number | string, sessionKey: number | string) => {
  return useQuery<any[]>({
    queryKey: ['telemetry', driverNumber, sessionKey],
    queryFn: async () => {
      if (!driverNumber || !sessionKey) return [];
      const res = await fetch(`${API_URL}/api/telemetry?driver_number=${driverNumber}&session_key=${sessionKey}`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    enabled: !!driverNumber && !!sessionKey,
  });
};

export const useRaceResults = (round: number | string) => {
  return useQuery<any[]>({
    queryKey: ['results', round],
    queryFn: async () => {
      if (!round) return [];
      const res = await fetch(`${API_URL}/api/results/${round}`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    enabled: !!round,
  });
};

export const useSessionKey = (country: string, year: number | string) => {
  return useQuery<any>({
    queryKey: ['sessionKey', country, year],
    queryFn: async () => {
      if (!country || !year) return null;
      const res = await fetch(`${API_URL}/api/session-key?country=${encodeURIComponent(country)}&year=${year}`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    enabled: !!country && !!year,
  });
};

export const useNextRace = () => {
  return useQuery<any>({
    queryKey: ['next-race'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/next-race`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    refetchInterval: 3600000,
  });
};

export const useWeather = (lat: string, long: string) => {
  return useQuery<any>({
    queryKey: ['weather', lat, long],
    queryFn: async () => {
      if (!lat || !long) return null;
      const res = await fetch(`${API_URL}/api/weather?lat=${lat}&long=${long}`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    enabled: !!lat && !!long,
  });
};

export const useCircuitInfo = (circuitId: string) => {
  return useQuery<any>({
    queryKey: ['circuit-info', circuitId],
    queryFn: async () => {
      if (!circuitId) return null;
      
      let backendData = null;
      try {
        const backendRes = await fetch(`${API_URL}/api/circuit-info/${circuitId}`);
        if (backendRes.ok) {
          backendData = await backendRes.json();
        }
      } catch (e) {
        console.warn('Backend circuit info failed', e);
      }

      let f1apiData = null;
      try {
        const f1apiRes = await fetch(`https://f1api.dev/api/circuits/${circuitId}`);
        if (f1apiRes.ok) {
          const data = await f1apiRes.json();
          if (data.circuit && data.circuit.length > 0) {
            f1apiData = data.circuit[0];
          }
        }
      } catch (e) {
        console.warn('f1api circuit info failed', e);
      }

      return {
        ...backendData,
        ...f1apiData,
        length: f1apiData?.circuitLength ? (f1apiData.circuitLength / 1000).toFixed(3) : backendData?.length,
        name: f1apiData?.circuitName || backendData?.name,
        location: {
          locality: f1apiData?.city || backendData?.location?.locality,
          country: f1apiData?.country || backendData?.location?.country
        }
      };
    },
    enabled: !!circuitId,
  });
};

export const useF1ApiDrivers = (year: number | string = new Date().getFullYear()) => {
  return useQuery<any>({
    queryKey: ['f1api-drivers', year],
    queryFn: async () => {
      const res = await fetch(`https://f1api.dev/api/${year}/drivers`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    refetchInterval: 3600000,
  });
};

export const useF1ApiDriver = (driverId: string, year: number | string = new Date().getFullYear()) => {
  return useQuery<any>({
    queryKey: ['f1api-driver', driverId, year],
    queryFn: async () => {
      if (!driverId) return null;
      const res = await fetch(`https://f1api.dev/api/${year}/drivers/${driverId}`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    enabled: !!driverId,
  });
};

export const useOpenF1DriverInfo = (driverNumber: number | string) => {
  return useQuery<any>({
    queryKey: ['openf1-driver', driverNumber],
    queryFn: async () => {
      if (!driverNumber) return null;
      const res = await fetch(`https://api.openf1.org/v1/drivers?driver_number=${driverNumber}&session_key=latest`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      return data && data.length > 0 ? data[0] : null;
    },
    enabled: !!driverNumber,
  });
};

export const useF1ApiSession = (year: number | string, round: number | string, session: string) => {
  return useQuery<any[]>({
    queryKey: ['f1api-session', year, round, session],
    queryFn: async () => {
      if (!year || !round || !session) return [];
      
      // Fallback to Jolpica API for Sprint Race
      if (session === 'sprint') {
        try {
          const res = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/${round}/sprint.json`);
          if (!res.ok) return [];
          const data = await res.json();
          const results = data.MRData?.RaceTable?.Races[0]?.SprintResults || [];
          return results.map((r: any) => ({
            position: r.position,
            time: r.Time?.time || r.status || '-',
            driver: {
              name: r.Driver.givenName,
              surname: r.Driver.familyName,
              number: r.number || r.Driver.permanentNumber
            },
            team: {
              name: r.Constructor.name
            }
          }));
        } catch (err) {
          console.error("Failed to fetch sprint from Jolpica", err);
          return [];
        }
      }
      
      if (session === 'sprint_qualy') {
        try {
          // OpenF1 API fetch for Sprint Qualifying
          const meetingsRes = await fetch(`https://api.openf1.org/v1/meetings?year=${year}`);
          const meetings = await meetingsRes.json();
          const raceMeetings = meetings.filter((m: any) => m.meeting_name !== 'Pre-Season Testing').sort((a: any, b: any) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());
          
          const meeting = raceMeetings[Number(round) - 1];
          if (!meeting) return [];

          const sessionsRes = await fetch(`https://api.openf1.org/v1/sessions?meeting_key=${meeting.meeting_key}&session_name=Sprint%20Qualifying`);
          const sessions = await sessionsRes.json();
          if (!sessions || sessions.length === 0) return [];
          
          const sessionKey = sessions[0].session_key;
          
          const [posRes, driversRes] = await Promise.all([
            fetch(`https://api.openf1.org/v1/position?session_key=${sessionKey}`),
            fetch(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`)
          ]);
          
          const posData = await posRes.json();
          const driversData = await driversRes.json();
          
          const finalPos: Record<number, number> = {};
          posData.forEach((p: any) => {
            finalPos[p.driver_number] = p.position;
          });
          
          const results = Object.entries(finalPos).map(([driverNum, position]) => {
            const driverInfo = driversData.find((d: any) => d.driver_number === Number(driverNum));
            return {
              position: position,
              time: 'Sprint Qualy',
              driver: {
                name: driverInfo?.first_name || '',
                surname: driverInfo?.last_name || '',
                number: Number(driverNum)
              },
              team: {
                name: driverInfo?.team_name || ''
              }
            };
          });
          
          return results.sort((a, b) => a.position - b.position);
        } catch (e) {
          console.error("Failed to fetch sprint qualy from OpenF1", e);
          return [];
        }
      }

      // Standard f1api.dev logic
      try {
        const res = await fetch(`https://f1api.dev/api/${year}/${round}/${session}`);
        if (res.ok) {
          const data = await res.json();
          const races = data.races;
          if (races) {
            if (session === 'race' && races.results) return races.results;
            if (session === 'qualy' && races.qualyResults) return races.qualyResults;
            if (session === 'fp1' && races.fp1Results) return races.fp1Results;
            if (session === 'fp2' && races.fp2Results) return races.fp2Results;
            if (session === 'fp3' && races.fp3Results) return races.fp3Results;
          }
        }
      } catch (err) {
        console.warn('f1api.dev failed, falling back to jolpica', err);
      }
      
      // Fallback to Jolpica if f1api.dev fails or is missing results
      const typeMap: Record<string, string> = {
        'race': 'results',
        'qualy': 'qualifying',
      };
      
      if (typeMap[session]) {
         try {
             const res = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/${round}/${typeMap[session]}.json`);
             if (res.ok) {
                 const data = await res.json();
                 const races = data.MRData?.RaceTable?.Races[0];
                 const results = session === 'race' ? races?.Results : races?.QualifyingResults;
                 if (results) {
                     return results.map((r: any) => ({
                      position: r.position,
                      time: r.Time?.time || r.status || r.Q3 || r.Q2 || r.Q1 || '-',
                      driver: {
                        name: r.Driver.givenName,
                        surname: r.Driver.familyName,
                        number: r.number || r.Driver.permanentNumber
                      },
                      team: {
                        name: r.Constructor.name
                      }
                    }));
                 }
             }
         } catch (err) {
             console.error("Jolpica fallback failed", err);
         }
      }

      return [];
    },
    enabled: !!year && !!round && !!session,
  });
};