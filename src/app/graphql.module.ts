import { NgModule } from "@angular/core";
import { Storage } from "@ionic/storage";
import { APOLLO_OPTIONS } from "apollo-angular";
import { HttpLink, HttpLinkModule } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import { NGXLogger } from "ngx-logger";
import { ApolloClientOptions } from "apollo-client";
import { onError } from "apollo-link-error";
import { from } from "apollo-link";
import { environment } from "../environments/environment";
import { TypedTypePolicies } from "src/generated/type-policies";

// should be able to catch the subfield with this, but since its strongly typed it wont work.
["items", ["id"]];

const typePolicies: TypedTypePolicies = {
  PaginatedInAppNotificationsResponse: {
    keyFields: ["items"],
  },
};

// this is here to access the cache directly
export const cache = new InMemoryCache();

export function createApollo(
  httpLink: HttpLink,
  storage: Storage,
  logger: NGXLogger
): ApolloClientOptions<any> {
  const authLink = setContext(async (_, { headers }) => {
    const token = await storage.get("token");
    if (!token) {
      logger.error("Couldn't add jwt to header.");
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
    console.log("errorLink");
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
  exports: [HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, Storage, NGXLogger],
    },
  ],
})
export class GraphQLModule {}
