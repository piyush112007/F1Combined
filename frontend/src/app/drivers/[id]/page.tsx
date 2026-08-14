'use client';

import { use } from 'react';
import styles from '../../page.module.css';
import { useF1ApiDriver } from '../../../api';
import { getDriverImageUrl, getDriverNumber } from '../../../utils/driverData';

export default function DriverDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const driverId = resolvedParams.id;
  
  const { data, isLoading } = useF1ApiDriver(driverId);
  
  if (isLoading) return <div className={styles.dashboard}><p>Loading driver details...</p></div>;
  if (!data || !data.driver) return <div className={styles.dashboard}><p>Driver not found.</p></div>;

  const { driver, team, results } = data;
  const imageUrl = getDriverImageUrl(driverId);
  const currentNumber = getDriverNumber(driverId) ?? driver.number;

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {imageUrl ? (
            <div style={{
              width: '160px',
              height: '160px',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '2px solid rgba(255,40,0,0.3)',
              flexShrink: 0,
            }}>
              <img 
                src={imageUrl} 
                alt={`${driver.name} ${driver.surname}`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
              />
            </div>
          ) : (
            <div style={{ 
              width: '160px', 
              height: '160px', 
              borderRadius: '16px', 
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '2px solid rgba(255,40,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px', 
              fontWeight: 'bold', 
              color: '#ff2800', 
              fontFamily: 'monospace'
            }}>
              {currentNumber || '-'}
            </div>
          )}
          <div>
            <h1 className={styles.title}>
              {driver.name} {driver.surname}
              <span style={{ marginLeft: '12px', fontSize: '18px', color: '#8b949e', fontWeight: 'normal' }}>
                #{currentNumber} · {driver.nationality}
              </span>
            </h1>
            <p className={styles.subtitle} style={{ textTransform: 'uppercase', marginTop: '8px' }}>
              {team.teamName} — {team.teamNationality}
            </p>
          </div>
        </div>
      </header>

      <div className={styles.grid}>
        <section className={styles.card} style={{ gridColumn: '1 / -1' }}>
          <h2>Race Results &amp; Comparison</h2>
          <div className={styles.cardContent}>
            {!results || results.length === 0 ? (
              <p>No results found for this driver in the current season.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #30363d', color: '#8b949e' }}>
                      <th style={{ padding: '12px 8px' }}>Round</th>
                      <th style={{ padding: '12px 8px' }}>Race</th>
                      <th style={{ padding: '12px 8px' }}>Qualifying (Grid)</th>
                      <th style={{ padding: '12px 8px' }}>Final Position</th>
                      <th style={{ padding: '12px 8px' }}>Positions Gained/Lost</th>
                      <th style={{ padding: '12px 8px' }}>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((res: any, index: number) => {
                      const gridPos = parseInt(res.result.gridPosition);
                      const finalPos = parseInt(res.result.finishingPosition);
                      const diff = !isNaN(gridPos) && !isNaN(finalPos) ? gridPos - finalPos : null;
                      
                      let diffColor = '#c9d1d9';
                      let diffIcon = '−';
                      if (diff !== null && diff > 0) {
                        diffColor = '#2ea043'; // Green for gaining
                        diffIcon = '▲';
                      } else if (diff !== null && diff < 0) {
                        diffColor = '#da3633'; // Red for losing
                        diffIcon = '▼';
                      }

                      return (
                        <tr key={index} style={{ borderBottom: '1px solid #21262d', transition: 'background 0.2s', cursor: 'default' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '12px 8px', color: '#8b949e' }}>{res.race.round}</td>
                          <td style={{ padding: '12px 8px', color: '#c9d1d9', fontWeight: 'bold' }}>{res.race.name}</td>
                          <td style={{ padding: '12px 8px', color: '#c9d1d9' }}>{!isNaN(gridPos) ? `P${gridPos}` : '−'}</td>
                          <td style={{ padding: '12px 8px', color: !isNaN(finalPos) ? '#c9d1d9' : '#da3633', fontWeight: isNaN(finalPos) ? 'bold' : 'normal' }}>
                            {!isNaN(finalPos) ? `P${finalPos}` : 'DNF'}
                          </td>
                          <td style={{ padding: '12px 8px', color: diffColor, fontWeight: 'bold' }}>
                            {diff !== null && diff !== 0 ? `${diffIcon} ${Math.abs(diff)}` : '−'}
                          </td>
                          <td style={{ padding: '12px 8px', color: '#ff2800', fontWeight: 'bold' }}>{res.result.pointsObtained}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className={styles.card} style={{ gridColumn: '1 / -1' }}>
          <h2>Team Information</h2>
          <div className={styles.cardContent}>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
                <div>
                  <div style={{ color: '#8b949e', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>First Appearance</div>
                  <div style={{ color: '#c9d1d9', fontSize: '24px', fontWeight: 'bold' }}>{team.firstAppeareance || '-'}</div>
                </div>
                <div>
                  <div style={{ color: '#8b949e', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Constructors Championships</div>
                  <div style={{ color: '#c9d1d9', fontSize: '24px', fontWeight: 'bold' }}>{team.constructorsChampionships || '0'}</div>
                </div>
                <div>
                  <div style={{ color: '#8b949e', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Drivers Championships</div>
                  <div style={{ color: '#c9d1d9', fontSize: '24px', fontWeight: 'bold' }}>{team.driversChampionships || '0'}</div>
                </div>
             </div>
             {team.url && (
                <div style={{ marginTop: '24px' }}>
                  <a href={team.url} target="_blank" rel="noopener noreferrer" style={{ color: '#58a6ff', textDecoration: 'none' }}>
                    View Team on Wikipedia →
                  </a>
                </div>
             )}
          </div>
        </section>
      </div>
    </div>
  );
}

