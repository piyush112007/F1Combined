'use client';

import styles from './page.module.css';
import Link from 'next/link';
import { useLatestWeekend, useLatestResults, useNextRace, useWeather, useConstructorStandings } from '../api';

export default function Dashboard() {
  const { data: weekend, isLoading: isWeekendLoading } = useLatestWeekend();
  const { data: results, isLoading: isResultsLoading } = useLatestResults();
  const { data: nextRace, isLoading: isNextRaceLoading } = useNextRace();
  const { data: weather } = useWeather(nextRace?.lat, nextRace?.long);
  const { data: constructors, isLoading: isConstructorsLoading } = useConstructorStandings();

  const driverStandings = [...(results || [])].sort((a, b) => a.position - b.position).slice(0, 5);
  const constructorStandings = [...(constructors || [])].sort((a: any, b: any) => a.position - b.position).slice(0, 5);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Latest F1 Intelligence</p>
      </header>

      <div className={styles.grid}>
        {isWeekendLoading ? (
          <div className={`${styles.card} ${styles.fullWidth}`}>
            <p>Fetching latest race...</p>
          </div>
        ) : weekend ? (
          <section className={`${styles.card} ${styles.fullWidth}`}>
            <h2>Latest Race: {weekend.name}</h2>
            <div className={styles.cardContent}>
              <p style={{ marginBottom: '16px' }}>Round {weekend.round} of the {weekend.season} Season</p>
              
              <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>Top 5 Finishers</h3>
              {isResultsLoading ? (
                <p>Loading results...</p>
              ) : results && results.length > 0 ? (
                <ul className={styles.standingsList}>
                  {driverStandings.map((res: any) => (
                    <li key={res.driver.id} className={styles.standingsItem}>
                      <span className={styles.position}>P{res.position}</span>
                      <span className={styles.driverName}>
                        <Link href={`/drivers/${res.driver.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {res.driver.firstName} {res.driver.lastName}
                        </Link>
                      </span>
                      <span className={styles.points}>+{res.points} pts</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No results available</p>
              )}
            </div>
          </section>
        ) : null}

        {isNextRaceLoading ? null : nextRace ? (
          <Link href={`/weekends/${nextRace.round}`} className={styles.cardLink}>
            <section className={`${styles.card} ${styles.clickableCard}`} style={{ borderLeft: '4px solid #d29922', height: '100%' }}>
              <div className={styles.cardHeader}>
                <h2>Next Race: {nextRace.raceName}</h2>
                <span className={styles.arrowIcon}>➔</span>
              </div>
              <div className={styles.cardContent}>
                <p style={{ color: '#8b949e' }}>{nextRace.circuitName} — {nextRace.locality}, {nextRace.country}</p>
                <p style={{ color: '#c9d1d9', fontWeight: 'bold' }}>{new Date(nextRace.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                
                {weather && (
                  <div className={styles.weatherBox}>
                    <div style={{ fontSize: '24px' }}>⛅</div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 'bold', color: '#ff2800' }}>OpenWeather Forecast</p>
                      <p style={{ margin: 0, color: '#c9d1d9' }}>
                        {weather.text} {weather.tempMax !== undefined ? `(${weather.tempMax}°C)` : ''} {weather.mock ? <span style={{ color: '#ff7b72', fontSize: '12px' }}><br/>{weather.error ? `OpenWeather Error: ${weather.error}` : '(Mock Data)'}</span> : ''}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </Link>
        ) : null}

        <Link href={`/constructors`} className={styles.cardLink}>
          <section className={`${styles.card} ${styles.clickableCard}`} style={{ height: '100%' }}>
            <div className={styles.cardHeader}>
              <h2>Top 5 Constructors</h2>
              <span className={styles.arrowIcon}>➔</span>
            </div>
            <div className={styles.cardContent}>
              {isConstructorsLoading ? (
                <p>Loading constructors...</p>
              ) : constructors && constructors.length > 0 ? (
                <ul className={styles.standingsList}>
                  {constructorStandings.map((res: any) => (
                    <li key={res.Constructor.constructorId} className={styles.standingsItem}>
                      <span className={styles.position}>P{res.position}</span>
                      <span className={styles.driverName}>{res.Constructor.name}</span>
                      <span className={styles.points}>{res.points} pts</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No standings available</p>
              )}
            </div>
          </section>
        </Link>

      </div>
    </div>
  );
}
