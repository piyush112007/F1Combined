'use client';

import styles from '../page.module.css';
import { useConstructorStandings } from '../../api';
import Link from 'next/link';

export default function ConstructorsPage() {
  const { data: standings, isLoading } = useConstructorStandings();

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Constructors Championship</h1>
        <p className={styles.subtitle}>Current Season Standings</p>
      </header>
      <div className={styles.grid}>
        <section className={styles.card} style={{ gridColumn: 'span 2' }}>
          <div className={styles.cardContent}>
            {isLoading ? (
              <p>Loading standings...</p>
            ) : standings && standings.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #30363d', color: '#8b949e' }}>
                      <th style={{ padding: '12px 8px' }}>Pos</th>
                      <th style={{ padding: '12px 8px' }}>Constructor</th>
                      <th style={{ padding: '12px 8px' }}>Nationality</th>
                      <th style={{ padding: '12px 8px' }}>Points</th>
                      <th style={{ padding: '12px 8px' }}>Wins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((st: any) => (
                      <tr key={st.Constructor.constructorId} style={{ borderBottom: '1px solid #21262d', transition: 'background 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '12px 8px', color: '#ff2800', fontWeight: 'bold' }}>{st.position}</td>
                        <td style={{ padding: '12px 8px', color: '#c9d1d9' }}>
                          <Link href={`/constructors/${st.Constructor.constructorId}`} style={{ color: st.position === '1' ? '#d4af37' : '#ffffff', textDecoration: 'none', fontWeight: 'bold' }}>
                            {st.Constructor.name}
                          </Link>
                        </td>
                        <td style={{ padding: '12px 8px', color: '#8b949e' }}>{st.Constructor.nationality}</td>
                        <td style={{ padding: '12px 8px', color: '#c9d1d9', fontWeight: 'bold' }}>{st.points}</td>
                        <td style={{ padding: '12px 8px', color: '#8b949e' }}>{st.wins}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No standings available.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
