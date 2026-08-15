'use client';

import { use } from 'react';
import styles from '../../page.module.css';
import { useF1ApiDrivers, useF1ApiDriver, useConstructorStandings, useDriverStandings } from '../../../api';
import { getDriverImageUrl, getDriverNumber } from '../../../utils/driverData';
import Link from 'next/link';

function DriverBriefSection({ driverId, driverStandings }: { driverId: string, driverStandings: any[] }) {
  const { data, isLoading } = useF1ApiDriver(driverId);

  if (isLoading) return <p style={{ color: '#8b949e', padding: '24px' }}>Loading driver {driverId}...</p>;
  if (!data || !data.driver) return null;

  const { driver, results } = data;
  const imageUrl = getDriverImageUrl(driverId);
  const currentNumber = getDriverNumber(driverId) ?? driver.number;

  const finishes = results?.map((r: any) => parseInt(r.result.finishingPosition)).filter((pos: number) => !isNaN(pos)) || [];
  const avgFinish = finishes.length > 0 ? Math.round(finishes.reduce((a: number, b: number) => a + b, 0) / finishes.length) : '-';

  const standing = driverStandings?.find((st: any) => st.Driver.driverId === driverId);

  return (
    <Link href={`/drivers/${driverId}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className={`${styles.card} ${styles.driverBriefCard}`}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={`${driver.name} ${driver.surname}`} 
          style={{ width: '80px', height: '80px', objectFit: 'cover', objectPosition: 'top', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }}
        />
      ) : (
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', color: '#ff2800', fontFamily: 'monospace' }}>
          {currentNumber || '-'}
        </div>
      )}
      <div style={{ flex: 1 }}>
        <h2 style={{ margin: 0, fontSize: '24px', color: '#c9d1d9' }}>{driver.name} {driver.surname}</h2>
        <div style={{ fontSize: '14px', color: '#8b949e', marginTop: '4px' }}>Car #{currentNumber}</div>
      </div>
      <div className={styles.driverBriefStat}>
        <div style={{ color: '#8b949e', fontSize: '12px', textTransform: 'uppercase' }}>Avg Finish</div>
        <div style={{ color: '#c9d1d9', fontSize: '24px', fontWeight: 'bold' }}>{avgFinish !== '-' ? `P${avgFinish}` : '-'}</div>
      </div>
      <div className={styles.driverBriefStanding}>
        <div style={{ color: '#8b949e', fontSize: '12px', textTransform: 'uppercase' }}>Championship Standing</div>
        <div style={{ color: '#d4af37', fontSize: '24px', fontWeight: 'bold' }}>{standing ? `P${standing.position} (${standing.points} pts)` : '-'}</div>
      </div>
    </div>
    </Link>
  );
}

export default function ConstructorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const constructorId = resolvedParams.id;
  
  const { data: driversData, isLoading } = useF1ApiDrivers();
  const { data: constructorStandings } = useConstructorStandings();
  const { data: driverStandings } = useDriverStandings();
  
  const constructorDrivers = driversData?.drivers?.filter((d: any) => d.teamId === constructorId) || [];
  
  const firstDriverId = constructorDrivers.length > 0 ? constructorDrivers[0].driverId : null;
  const { data: firstDriverData } = useF1ApiDriver(firstDriverId || '');
  const teamDetails = firstDriverData?.team;

  const currentStanding = constructorStandings?.find((st: any) => st.Constructor.constructorId === constructorId);

  if (isLoading) return <div className={styles.dashboard}><p>Loading constructor details...</p></div>;

  const constructorName = constructorId.charAt(0).toUpperCase() + constructorId.slice(1).replace('_', ' ');

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.constructorHeader}>
          <div>
            <h1 className={`${styles.title} ${styles.constructorTitle}`}>{teamDetails?.teamName || constructorName}</h1>
            <p className={styles.subtitle} style={{ textTransform: 'uppercase', fontSize: '18px' }}>
              {teamDetails?.teamNationality || 'Constructor'}
            </p>
          </div>
          {currentStanding && (
            <div className={styles.driverBriefStanding}>
              <div style={{ color: '#8b949e', fontSize: '14px', textTransform: 'uppercase', marginBottom: '8px' }}>Current Standing</div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: currentStanding.position === '1' ? '#d4af37' : '#c9d1d9', lineHeight: 1 }}>
                P{currentStanding.position}
              </div>
              <div style={{ color: '#ff2800', fontWeight: 'bold', fontSize: '20px', marginTop: '4px' }}>
                {currentStanding.points} PTS
              </div>
            </div>
          )}
        </div>
      </header>

      {teamDetails && (
        <section className={styles.card} style={{ marginBottom: '32px' }}>
          <h2>Constructor History</h2>
          <div className={styles.cardContent}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              <div>
                <div style={{ color: '#8b949e', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>First Appearance</div>
                <div style={{ color: '#c9d1d9', fontSize: '24px', fontWeight: 'bold' }}>{teamDetails.firstAppeareance || '-'}</div>
              </div>
              <div>
                <div style={{ color: '#8b949e', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Constructors Championships (WCC)</div>
                <div style={{ color: '#d4af37', fontSize: '24px', fontWeight: 'bold' }}>{teamDetails.constructorsChampionships || '0'}</div>
              </div>
              <div>
                <div style={{ color: '#8b949e', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Drivers Championships (WDC)</div>
                <div style={{ color: '#d4af37', fontSize: '24px', fontWeight: 'bold' }}>{teamDetails.driversChampionships || '0'}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div>
        <h2 style={{ color: '#c9d1d9', marginBottom: '16px' }}>Current Drivers</h2>
        {constructorDrivers.length === 0 ? (
          <p style={{ color: '#8b949e' }}>No drivers found for this constructor in the 2026 season.</p>
        ) : (
          constructorDrivers.map((driver: any) => (
            <DriverBriefSection key={driver.driverId} driverId={driver.driverId} driverStandings={driverStandings || []} />
          ))
        )}
      </div>
    </div>
  );
}
