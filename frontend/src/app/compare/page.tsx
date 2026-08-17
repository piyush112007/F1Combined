import styles from '../page.module.css';
import { GiCrossedSwords } from 'react-icons/gi';

export default function ComparePage() {
  return (
    <div className={styles.dashboard} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
      <section className={styles.card} style={{ maxWidth: '550px', width: '100%', textAlign: 'center', padding: '48px 32px' }}>
        <div className={styles.cardContent} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <GiCrossedSwords size={48} style={{ color: '#ff2800' }} />
          <h1 className={styles.title} style={{ margin: 0, fontSize: '28px' }}>
            Comparison tool is coming soon
          </h1>
        </div>
      </section>
    </div>
  );
}
