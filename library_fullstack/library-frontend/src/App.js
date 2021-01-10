import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommend from './components/Recommend'
import { useApolloClient } from '@apollo/client'

const App = () => {
  const [page, setPage] = useState('authors')
  const [user, setUser] = useState(null)
  const client = useApolloClient()

  const hook = () => {
    setUser(localStorage.getItem('user'))
  }

  useEffect(hook, [])

  const handleLogout = () => {
    setUser(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        {user} logged in
        <br/>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!user && <button onClick={() => setPage('login')}>login</button>}
        {user && <button onClick={() => setPage('add')}>add book</button>}
        {user && <button onClick={() => setPage('recommend')}>recommend</button>}
        {user && <button onClick={handleLogout}>logout</button>}
      </div>

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add' && user}
        page={page}
        setPage={setPage}
        user={user}
      />

      <Recommend
        show={page === 'recommend' && user}
      />

      <Login
        show={page === 'login' && !user}
        setUser={setUser}
        setPage={setPage}
      />

    </div>
  )
}

export default App