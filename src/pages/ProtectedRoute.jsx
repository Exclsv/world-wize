import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/FakeAuthContext'
import { useEffect } from 'react'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) navigate('/')
  }, [])

  // As useEffect runs only after the first render which includes the 'User' component(which will break app if no user)
  // we have to check the isAuthenticated state and conditionally render the children components
  return isAuthenticated ? children : null
}
