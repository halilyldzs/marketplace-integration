import React from "react"
import styles from "./Home.module.css"

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hoş Geldiniz</h1>
      <p className={styles.description}>
        Bu modern React uygulamasına hoş geldiniz. Başlamak için aşağıdaki
        özellikleri kullanabilirsiniz:
      </p>
      <ul className={styles.featureList}>
        <li className={styles.featureItem}>
          <span className={styles.checkmark}>✓</span>
          TypeScript desteği
        </li>
        <li className={styles.featureItem}>
          <span className={styles.checkmark}>✓</span>
          Modern bileşen yapısı
        </li>
        <li className={styles.featureItem}>
          <span className={styles.checkmark}>✓</span>
          Responsive tasarım
        </li>
      </ul>
    </div>
  )
}

export default Home
