import {
  Environment,
  Network,
  RecordSource,
  Store,
  Variables,
  RequestParameters,
  CacheConfig,
  Observable,
} from 'relay-runtime';
import { createClient, ExecutionResult } from 'graphql-sse';

const base = import.meta.env.VITE_GRAPHQL_BASE ?? '';
const client = createClient<true>({
  url: `${base}/api/graphql/stream`,
});

async function fetchRelay(
  params: RequestParameters,
  variables: Variables,
  _cacheConfig: CacheConfig
) {
  const base = import.meta.env.VITE_GRAPHQL_BASE ?? '';
  const response = await fetch(`${base}/api/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: params.text,
      variables
    })
  });

  const json = await response.json();

  // GraphQL returns exceptions (for example, a missing required variable) in the "errors"
  // property of the response. If any exceptions occurred when processing the request,
  // throw an error to indicate to the developer what went wrong.
  if (Array.isArray(json.errors)) {
    console.log(json.errors);
    throw new Error(
      `Error fetching GraphQL query '${
        params.name
      }' with variables '${JSON.stringify(variables)}': ${JSON.stringify(
        json.errors
      )}`
    );
  }

  // Otherwise, return the full payload.
  return json;
}

export function subscribe(
  params: RequestParameters,
  variables: Variables,
  _cacheConfig: CacheConfig
) {
  return Observable.create<any>((sink) => {
    client.subscribe(
      {
        query:  params.text ?? '',
        operationName: params.name,
        variables,
      },
      sink
    );
  });
}

// Export a singleton instance of Relay Environment configured with our network layer:
export default new Environment({
  network: Network.create(fetchRelay, subscribe),
  store: new Store(new RecordSource(), {
    // This property tells Relay to not immediately clear its cache when the user
    // navigates around the app. Relay will hold onto the specified number of
    // query results, allowing the user to return to recently visited pages
    // and reusing cached data if its available/fresh.
    gcReleaseBufferSize: 10
  })
});
