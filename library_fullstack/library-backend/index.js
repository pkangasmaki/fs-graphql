const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const Author = require('./models/Author')
const Book = require('./models/Book')
const User = require('./models/User')

const JWT_SECRET = 'ULTIMATE_SECRET_KEY'

const MONGODB_URI = 'mongodb+srv://graafinen:fyllstock@cluster0.wsqq6.mongodb.net/<dbname>?retryWrites=true&w=majority'

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    //Täydennä sovellusta siten, että kaikki kyselyt (paitsi kyselyn allBooks parametri author)
    allBooks: async (root, args) => {
      //allBooks( author: "Name", genre: "Genre" )
      if (args.genre && args.author) {
        const correctAuthor = await Author.find({name:args.author})
        return Book.find({ genres: args.genre, author: correctAuthor })
      }
      //allBooks( genre: "Genre" )
      if (args.genre) {
        const book = await Book.find({ genres: args.genre}).populate('author')
        return book
      }
      ////allBooks( author: "Name" )
      if (args.author) {
        const correctAuthor = await Author.find({name:args.author})
        return Book.find({ author: correctAuthor })
      }
      //No args
      const book = await Book.find({}).populate('author')
      return book
    },
    allAuthors: () => Author.find({}),
    me: (root, args, context) => {
      return context.user
    }
  },
  Author: {
    bookCount: async (root) => {
      const authorsBooks = await Book.find({author: root})
      return authorsBooks.length
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {

      const user = context.user

      if (!user) {
        throw new AuthenticationError("not authenticated")
      }

      let correctAuthor = ''

      const authorExists = await Author.findOne({ name: args.author })

      if (!authorExists) {
        const author = new Author ({
          name: args.author,
          born: null
        })
        try {
          await author.save()
          correctAuthor = author
        } catch (err) {
          throw new UserInputError(err.message, {
            invalidArgs: args,
          })
        }
      } else {
        correctAuthor = authorExists
      }

      const book = new Book({ ...args, author: correctAuthor })

      try {
        await book.save()
      } catch (error) {
        throw new UserInputError (error.message, {
          invalidArgs: args,
        })
      }

      return book
    },
     editAuthor: async (root, args, context) => {

      const user = context.user

      if (!user) {
        throw new AuthenticationError("not authenticated")
      }

       const correctAuthor = await Author.find({ name: args.name })

       if (!correctAuthor) {
         return null
       }

      await Author.updateOne({ name: args.name },
        {
          $set: { born: Number(args.setBornTo)}
        })
      const updated = await Author.find({ name: args.name })
      return updated[0]
    },
    createUser: async (root, args) => {
      const user = new User ({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      })
      try {
        await user.save()
        return user
      } catch (err) {
        throw new UserInputError(err.message, {
          invalidArgs: args
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'password' ) {
        throw new UserInputError('Invalid credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      const token = jwt.sign(userForToken, JWT_SECRET)
      return { value: token }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization
    if (!token || !token.toLowerCase().startsWith('bearer ')) {
      return null
    }
    const decodedToken = jwt.verify(
      token.substring(7), JWT_SECRET
    )
    const user = await User.findById(decodedToken.id)
    return { user }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})