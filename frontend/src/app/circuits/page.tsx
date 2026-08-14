import styles from '../page.module.css';

export default function CircuitsPage() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Circuits</h1>
        <p className={styles.subtitle}>Track data and historical intelligence</p>
      </header>
      <div className={styles.grid}>
        <section className={styles.card}>
          <div className={styles.cardContent}>
            <p>Circuit data coming soon.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
