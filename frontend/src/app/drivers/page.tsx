'use client';

import styles from '../page.module.css';
import { useDriverStandings } from '../../api';
import { getDriverImageUrl, getDriverNumber } from '../../utils/driverData';
import Link from 'next/link';

export default function DriversPage() {
  const { data: standings, isLoading } = useDriverStandings();

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Drivers Championship</h1>
        <p className={styles.subtitle}>Current Season Standings</p>
      </header>
      <div className={styles.grid}>
        <section className={styles.card} style={{ gridColumn: 'span 2' }}>
          <div className={styles.cardContent}>
            {isLoading ? (
              <p>Loading standings...</p>
            ) : standings && standings.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #30363d', color: '#8b949e' }}>
                    <th style={{ padding: '12px 8px' }}>Pos</th>
                    <th style={{ padding: '12px 8px' }}>Driver</th>
                    <th style={{ padding: '12px 8px' }}>No.</th>
                    <th style={{ padding: '12px 8px' }}>Constructor</th>
                    <th style={{ padding: '12px 8px' }}>Points</th>
                    <th style={{ padding: '12px 8px' }}>Wins</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((st: any) => {
                    const driverId = st.Driver.driverId;
                    const imageUrl = getDriverImageUrl(driverId);
                    const currentNumber = getDriverNumber(driverId) ?? st.Driver.permanentNumber;
                    return (
                    <tr key={driverId} style={{ borderBottom: '1px solid #21262d', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '12px 8px', color: '#ff2800', fontWeight: 'bold' }}>{st.position}</td>
                      <td style={{ padding: '12px 8px', color: '#c9d1d9' }}>
                        <Link href={`/drivers/${driverId}`} style={{ color: st.position === '1' ? '#d4af37' : '#ffffff', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {imageUrl ? (
                            <img src={imageUrl} alt={`${st.Driver.givenName} ${st.Driver.familyName}`} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', backgroundColor: 'rgba(255,255,255,0.05)' }} />
                          ) : (
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#8b949e', fontFamily: 'monospace' }}>
                              {st.Driver.code || '-'}
                            </div>
                          )}
                          {st.Driver.givenName} {st.Driver.familyName}
                        </Link>
                      </td>
                      <td style={{ padding: '12px 8px', color: '#ff2800', fontFamily: 'monospace', fontWeight: 'bold' }}>#{currentNumber}</td>
                      <td style={{ padding: '12px 8px', color: '#8b949e' }}>{st.Constructors[0]?.name}</td>
                      <td style={{ padding: '12px 8px', color: '#c9d1d9', fontWeight: 'bold' }}>{st.points}</td>
                      <td style={{ padding: '12px 8px', color: '#8b949e' }}>{st.wins}</td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p>No standings available.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

