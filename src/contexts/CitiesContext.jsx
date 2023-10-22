import {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback
} from 'react'

const BASE_URL = 'http://localhost:5100'

const CitiesContext = createContext()

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: ''
}

function reducer(state, action) {
  switch (action.type) {
    case 'cities/loading':
      return {
        ...state,
        isLoading: true
      }
    case 'cities/loaded':
      return {
        ...state,
        isLoading: false,
        cities: action.payload
      }

    case 'citySelected':
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload
      }

    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload
      }

    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter(city => city.id !== action.payload),
        currentCity: {}
      }

    case 'rejected':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    default:
      throw new Error('Unknown action type')
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  )

  useEffect(() => {
    const fetchCities = async () => {
      dispatch({ type: 'cities/loading' })

      try {
        const res = await fetch(`${BASE_URL}/cities`)
        const data = await res.json()
        dispatch({ type: 'cities/loaded', payload: data })
      } catch {
        dispatch({
          type: 'rejected',
          payload: 'There was an error on loading cities...'
        })
      }
    }

    fetchCities()
  }, [])

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return

      dispatch({ type: 'cities/loading' })

      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`)
        const data = await res.json()
        dispatch({ type: 'citySelected', payload: data })
      } catch {
        dispatch({
          type: 'rejected',
          payload: 'There was an error on loading the city...'
        })
      }
    },
    [currentCity.id]
  )
// 253
  async function createCity(newCity) {
    dispatch({ type: 'cities/loading' })

    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCity)
      })
      const data = await res.json()
      dispatch({ type: 'city/created', payload: data })
    } catch (e) {
      console.error('There was an error on creating city')
    }
  }

  async function deleteCity(id) {
    dispatch({ type: 'cities/loading' })

    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE'
      })
      dispatch({ type: 'city/deleted', payload: id })
    } catch {
      console.error('There was an error on deleting city')
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity
      }}
    >
      {children}
    </CitiesContext.Provider>
  )
}

function useCities() {
  const context = useContext(CitiesContext)
  if (context === undefined)
    throw new Error('useCities must be used within a CitiesProvider')
  return context
}

export { CitiesProvider, useCities }
