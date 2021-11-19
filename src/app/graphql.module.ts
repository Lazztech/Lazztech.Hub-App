import { NgModule } from '@angular/core';
import { Storage } from '@ionic/storage';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { HttpClientModule } from '@angular/common/http';
import { InMemoryCache, ApolloClientOptions, from } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { NGXLogger } from 'ngx-logger';
import { onError } from '@apollo/client/link/error';
import { environment } from '../environments/environment';
import { TypedTypePolicies } from 'src/generated/type-policies';

const typePolicies: TypedTypePolicies = {
  Query: {
    fields: {
      paginatedInAppNotifications: {
        keyArgs: false,
        merge(existing = {}, incoming) {
          return {
            ...existing,
            ...incoming,
            items: existing?.items?.length
              ? [...existing?.items, ...incoming?.items]
              : incoming?.items,
          };
        },
      },
    },
  },
};

// this is here to access the cache directly
export const cache = new InMemoryCache({ typePolicies });

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
          Authorization: `Bearer ${token}`,
        },
      };
    }
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    let err: string;
    console.log('errorLink');
    graphQLErrors?.forEach(({ message, locations, path }) => {
      err += `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
        locations
      )}, Path: ${JSON.stringify(path)} \n`;
    });
    err += `[Network error]: ${JSON.stringify(networkError)}`;
    console.log(err);
    alert(err);
  });

  const apolloLink = httpLink.create({
    uri: `${environment.serverUrl}graphql`,
    withCredentials: true,
  });

  return {
    link: from([errorLink, authLink, apolloLink]),
    cache,
    connectToDevTools: environment.apollo.connectToDevTools,
  } as ApolloClientOptions<any>;
}

@NgModule({
  exports: [HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, Storage, NGXLogger],
    },
  ],
})
export class GraphQLModule {}
