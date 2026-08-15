'use client';

import styles from '../page.module.css';
import { useSchedule } from '../../api';

export default function WeekendsPage() {
  const { data: schedule, isLoading } = useSchedule();

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>2026 Race Calendar</h1>
        <p className={styles.subtitle}>Complete Formula 1 Season Schedule</p>
      </header>
      <div className={styles.grid}>
        <section className={styles.card} style={{ gridColumn: 'span 2' }}>
          <div className={styles.cardContent}>
            {isLoading ? (
              <p>Loading season calendar...</p>
            ) : schedule && schedule.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #30363d', color: '#8b949e' }}>
                      <th style={{ padding: '12px 8px' }}>Rnd</th>
                      <th style={{ padding: '12px 8px' }}>Grand Prix</th>
                      <th style={{ padding: '12px 8px' }}>Circuit</th>
                      <th style={{ padding: '12px 8px' }}>Location</th>
                      <th style={{ padding: '12px 8px' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((race: any) => {
                      const raceStart = new Date(`${race.date}T${race.time || '00:00:00Z'}`);
                      const raceEnd = new Date(raceStart.getTime() + 3 * 60 * 60 * 1000);
                      const now = new Date();
                      const isOngoing = now >= raceStart && now <= raceEnd;
                      const isCompleted = now > raceEnd;

                      return (
                        <tr
                          key={race.round}
                          style={{
                            borderBottom: isOngoing ? '1px solid rgba(255, 40, 0, 0.4)' : '1px solid #21262d',
                            background: isOngoing ? 'rgba(255, 40, 0, 0.05)' : 'transparent',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onClick={() => window.location.href = `/weekends/${race.round}`}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = isOngoing ? 'rgba(255, 40, 0, 0.1)' : 'rgba(255,255,255,0.02)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = isOngoing ? 'rgba(255, 40, 0, 0.05)' : 'transparent';
                          }}
                        >
                          <td style={{ padding: '12px 8px', color: '#ff2800', fontWeight: 'bold' }}>{race.round}</td>
                          <td style={{ padding: '12px 8px', color: '#c9d1d9', fontWeight: 'bold' }}>
                            {race.raceName}
                            {isOngoing ? (
                              <span style={{
                                marginLeft: '8px',
                                fontSize: '12px',
                                color: '#ff2800',
                                fontWeight: 'bold',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}>
                                <span style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  backgroundColor: '#ff2800',
                                  display: 'inline-block',
                                  animation: 'live-pulse 1s infinite'
                                }}></span>
                                LIVE NOW
                              </span>
                            ) : isCompleted ? (
                              <span style={{ marginLeft: '8px', fontSize: '12px', color: '#3fb950' }}>Completed</span>
                            ) : (
                              <span style={{ marginLeft: '8px', fontSize: '12px', color: '#d29922' }}>Upcoming</span>
                            )}
                          </td>
                          <td style={{ padding: '12px 8px', color: '#8b949e' }}>{race.circuitName}</td>
                          <td style={{ padding: '12px 8px', color: '#8b949e' }}>{race.locality}, {race.country}</td>
                          <td style={{ padding: '12px 8px', color: '#c9d1d9' }}>{new Date(race.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No schedule available.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
