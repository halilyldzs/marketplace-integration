import React from "react"
import styles from "./Header.module.css"

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>React App</div>
          <div className={styles.navLinks}>
            <a
              href='/'
              className={styles.navLink}>
              Ana Sayfa
            </a>
            <a
              href='/hakkimizda'
              className={styles.navLink}>
              Hakkımızda
            </a>
            <a
              href='/iletisim'
              className={styles.navLink}>
              İletişim
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
