import React, { useState } from 'react'
import { LOG_IN } from '../queries'
import { useMutation } from '@apollo/client'

const Authors = ( {show, setUser, setPage} ) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [ logIn ] = useMutation(LOG_IN, {
    onError: (error) => {
      alert(error.graphQLErrors[0].message)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    
    logIn({ variables: { username, password } })
    .then((res) => {
      if(!res) {
        return
      }
      localStorage.setItem('user-token', res.data.login.value)
      localStorage.setItem('user', username)
      setUser(username)
      setPage('authors')
      return
    })
    setUsername('')
    setPassword('')
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>name <input value={username} onChange={(e) => setUsername(e.target.value)}></input></div>
        <div>password <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}></input></div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default Authors
