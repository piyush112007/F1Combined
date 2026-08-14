import styles from '../page.module.css';

export default function ComparePage() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Compare</h1>
        <p className={styles.subtitle}>Head-to-head driver and team comparisons</p>
      </header>
      <div className={styles.grid}>
        <section className={styles.card}>
          <div className={styles.cardContent}>
            <p>Comparison tools coming soon.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
