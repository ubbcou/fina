import { Feed } from '@/components/Feed';
import styles from '@/styles/Home.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoHighlight}>Fina</span>Flash
        </div>
        <div className={styles.nav}>
          <span className={styles.statusOnline}>● 实时监控中</span>
          <a href="https://github.com/ubbcou/fina" target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
            GitHub
          </a>
        </div>
      </header>

      <div className={styles.content}>
        <Feed />
      </div>
    </main>
  );
}
