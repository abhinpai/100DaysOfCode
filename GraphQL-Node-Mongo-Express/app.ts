const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const events = [];

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
            createEvent(eventinput: Eventinput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        } 
    `),
    rootValue: {
      event: () => {
        return events;
      },
      createEvent: args => {
        console.log(args);
        const event = {
          _id: Math.random().toString(),
          title: args.eventinput.title,
          description: args.eventinput.description,
          price: +args.eventinput.price, // + symbol will convert into number
          date: args.eventinput.date
        };
        events.push(event);
        return event;
      }
    },
    graphiql: true
  })
);

app.listen(3000);
