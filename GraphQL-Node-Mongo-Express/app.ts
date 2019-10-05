const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const MyEvent = require('./models/event');

const app = express();


app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHttp({
    // Schema: are the operation type where the graphql will understand thre schema
    // query: is one of the operation of GraphQL
    // mutation: is one of the operation of GraphQL
    // subscription: is one of the operation of GraphQL
    // RootQuery: will hold all query throught the application
    // RootMutation: will hold all kind of the mutation of application such as delete, update, insert
    // rootValue: its a resolver. Whenever the client request comes the the schema will validate the request if its present then it goes to resolver to query or mutate the data
    // The resolver name should be same as mutation and qurery tpye names
    // Exclamation Marks: Exclamation marks are used to prevent the nullable i.e any fields end with ! can not be null it must have some or the other data in it
    // 'type' keyword is to create the custom type for ex: Event in this application
    // 'input' type keyword is used to create the argument list

    schema: buildSchema(`

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input Eventinput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            event: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: Eventinput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        } 
    `),
    rootValue: {
      event: () => {
        return MyEvent.find()
          .then(res => {
            return res.map(x => {
              return { ...x._doc };
            });
          })
          .catch(err => {
            throw err;
          });
      },

      createEvent: args => {
        const event = new MyEvent({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price, // + symbol will convert into number
          date: new Date(args.eventInput.date)
        });
        return event
          .save()
          .then(result => {
            console.log(result);
            return { ...result._doc };
          })
          .catch(err => {
            console.log(err);
            throw err;
          });

        return event;
      }
    },
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-lcvog.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.log('Error Occured');
    console.log(err);
  });
export {};
