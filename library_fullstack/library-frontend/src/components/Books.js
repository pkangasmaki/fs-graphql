import React, { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { ALL_BOOKS, GENRE_BOOKS } from '../queries'

const Books = (props) => {

  const [chosenGenre, setChosenGenre] = useState('all')
  const [books, setBooks] = useState([])
  const [getGenreLazy, { data }] = useLazyQuery(GENRE_BOOKS)
  const booklist = useQuery(ALL_BOOKS, {
    pollInterval: 2000
  })

  //Set all books visible by default
  useEffect(() => {
    if(booklist.data) {
      if(chosenGenre === 'all') {
        setBooks(booklist.data.allBooks)
      }
    }
  //eslint-disable-next-line
  }, [booklist.data])

  //Change visibility of books based by genre chosen by button
  useEffect(() => {
    if (data) {
      if(chosenGenre === 'all' || !chosenGenre) setBooks(booklist.data.allBooks)
      else setBooks(data.allBooks)
    }
  }, [data, chosenGenre, booklist.data])

  //Handle gql calls when clicking button
  const handleLazyButton = (e) => {
    const genre = e.target.value
    setChosenGenre(genre)
    getGenreLazy({ variables: { genre } })
  }

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books, genre: {chosenGenre}</h2>

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
      <button onClick={handleLazyButton} value='refactoring'>refactoring</button>
      <button onClick={handleLazyButton} value='agile'>agile</button>
      <button onClick={handleLazyButton} value='patterns'>patterns</button>
      <button onClick={handleLazyButton} value='design'>design</button>
      <button onClick={handleLazyButton} value='crime'>crime</button>
      <button onClick={handleLazyButton} value='classic'>classic</button>
      <button onClick={handleLazyButton} value='database'>database</button>
      <button onClick={handleLazyButton} value='all'>all genres</button>
    </div>
  )
}

export default Books