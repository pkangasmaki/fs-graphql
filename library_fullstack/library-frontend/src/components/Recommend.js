import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, LOGGED_USER } from '../queries'

const Recommend = ( { show }) => {

  const result = useQuery(ALL_BOOKS, {
    pollInterval: 2000
  })

  const loggedUser = useQuery(LOGGED_USER, {
    pollInterval: 2000
  })

  const [favGenre, setFavGenre] = useState('')
  const [books, setBooks] = useState([])

  const hook = () => {
    if(result.data && loggedUser.data && localStorage.getItem('user')) {
        if(!loggedUser.data.me) {
          return
        }
        const allBooks = result.data.allBooks
        const filtered = allBooks.filter(book => book.genres.includes(loggedUser.data.me.favoriteGenre
          ))
        setBooks(filtered)
        setFavGenre(loggedUser.data.me.favoriteGenre)
      }
    }

  useEffect(hook, [loggedUser.data, result.data, localStorage.getItem('user')])

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <b>{favGenre}</b></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
