import React, { useState, useEffect } from 'react'
import { EDIT_AUTHOR } from '../queries'
import { useMutation } from '@apollo/client'

const Birthyear = ({ authors }) => {

  const [ name, setName ] = useState('')
  const [ born, setBorn ] = useState('')
  const [ editAuthor ] = useMutation(EDIT_AUTHOR)
  const [ options, setOptions] = useState('')

  const hook = () => {
    if(authors.length > 0) {
      //Create options for select-field from Authors array
      const selectOptions = authors.map(author => <option key={author.name} value={author.name}>{author.name}</option>)
      setOptions(selectOptions)
    }
  }

  useEffect(hook, [authors])

  const handleSubmit = (e) => {
    e.preventDefault()
    if(!born) {
      alert('Set a year of born!')
      return
    }
    if(!name) {
      alert('Select an author!')
    }

    //Mutate the author with gql mutation
    editAuthor( { variables: { name: name, born: born } })
    setName('')
    setBorn('')
  }

  const handleBorn = (event) => {
    //Born value does not accept anything but numbers
    if(event.target.value.match(/^[0-9]+$/) != null) {
      setBorn(Number(event.target.value))
    }
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={handleSubmit}>
        <select defaultValue='default' onChange={(event) => setName(event.target.value)}>
          <option disabled value='default'> -- Select author --  </option>
          {options}
        </select>
        <div>
          born <input value={born} onChange={handleBorn} />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Birthyear