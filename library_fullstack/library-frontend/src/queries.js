import { gql  } from '@apollo/client'

export const GENRE_BOOKS = gql`
  query genre ($genre: String!) {
    allBooks(genre: $genre) {
      title
      author {name}
      published
    }
  }
`

export const LOGGED_USER = gql`
  query logged_user {
    me {
      username
      favoriteGenre
    }
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      genres
      author { 
        name
      }
    }
  }
`

export const ADD_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook (
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      published
      author {
        name
      }
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation changeYear($name: String!, $born: Int!) {
    editAuthor (
      name: $name
      setBornTo: $born
    ) {
      name
      born
    }
  }
`

export const LOG_IN = gql`
  mutation log_in($username: String!, $password: String!) {
    login(
      username: $username
      password: $password
      ) {
      value
    }
  }
`