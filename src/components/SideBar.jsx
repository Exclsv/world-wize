import { Outlet } from 'react-router-dom'
import AppNav from './AppNav'
import Footer from './Footer'
import Logo from './Logo'
import styles from './SideBar.module.css'
export default function SideBar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />

      {/* Renders the child route's element, if there is one */}
      <Outlet />

      <Footer />
    </div>
  )
}
