import { NgModule } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { NGXLogger } from 'ngx-logger';
import { SERVER_URL } from 'src/environments/environment';
import { ApolloClientOptions } from 'apollo-client';
import { onError } from 'apollo-link-error';
import { from } from 'apollo-link';


export function createApollo(
  httpLink: HttpLink,
  storage: Storage,
  logger: NGXLogger
): ApolloClientOptions<any> {

  const authLink = setContext(async (_, { headers }) => {
    const token = await storage.get('token');
    if (!token) {
      logger.error('Couldn\'t add jwt to header.');
      return {};
    } else {
      return {
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`
        }
      };
    }
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    let err: string;
    console.log('errorLink');
    graphQLErrors?.forEach(({ message, locations, path }) => {
      err += `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path} \n`;
    });
    err += `[Network error]: ${networkError}`;
    console.log(err);
    alert(err);
  });

  const apolloLink = httpLink.create({
    uri: `${SERVER_URL}graphql`,
    withCredentials: true
  });

  return {
    link: from([errorLink, authLink, apolloLink]),
    cache: new InMemoryCache(),
    connectToDevTools: true, // TODO set based on environment variable, eg. dev or prod
  } as ApolloClientOptions<any>;
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, Storage, NGXLogger],
    },
  ],
})
export class GraphQLModule { }
