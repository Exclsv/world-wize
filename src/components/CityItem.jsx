import { Link } from 'react-router-dom'
import styles from './CityItem.module.css'
import { useCities } from '../contexts/CitiesContext'

const formatDate = date =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date))

export default function CityItem({
  city: {
    cityName,
    emoji,
    date,
    id,
    position: { lat, lng }
  }
}) {
  const { currentCity, deleteCity } = useCities()
  const activeCityClass =
    currentCity.id === id ? styles['cityItem--active'] : ''

  function handleDeleteCity(e) {
    e.preventDefault()
    deleteCity(id)
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${activeCityClass}`}
        to={`${id}?lat=${lat}&lng=${lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn} onClick={handleDeleteCity}>
          &times;
        </button>
      </Link>
    </li>
  )
}
