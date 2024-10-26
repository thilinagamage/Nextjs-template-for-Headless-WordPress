import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://headless-wp.local/graphql',  // Use your LocalWP GraphQL URL
  cache: new InMemoryCache(),
});

export default client;
