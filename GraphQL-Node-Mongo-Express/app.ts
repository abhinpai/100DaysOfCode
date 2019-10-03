const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

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
      
    schema: buildSchema(`
        type RootQuery {
            event: [String!]!
        }

        type RootMutation {

        }

        schema {
            query: RootQuery
            mutation: RootMutation
        } 
    `),
    rootValue: {}
  })
);

app.listen(3000);
