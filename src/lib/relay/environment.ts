import {
  Environment,
  Network,
  RecordSource,
  Store,
  FetchFunction,
  RequestParameters,
  Variables
} from 'relay-runtime';

// Create a singleton instance to avoid recreating the environment
let relayEnvironment: Environment | undefined;

// Request deduplication: prevent duplicate in-flight requests
const inflightRequests = new Map<string, Promise<any>>();

function getRequestKey(request: RequestParameters, variables: Variables): string {
  return `${request.name || request.id}:${JSON.stringify(variables)}`;
}

const fetchFn: FetchFunction = async (
  request: RequestParameters,
  variables: Variables
) => {
  // Ensure we're in browser environment
  if (typeof window === 'undefined') {
    return { data: {}, errors: [], extensions: {} };
  }

  const key = getRequestKey(request, variables);

  // Deduplicate: if the same query is already in-flight, reuse it
  const inflight = inflightRequests.get(key);
  if (inflight) {
    return inflight;
  }

  const url = `${window.location.origin}/api/graphql`;

  const promise = (async () => {
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: request.text,
          variables,
        }),
      });

      if (!resp.ok) {
        throw new Error(`Network error, status: ${resp.status}`);
      }

      return await resp.json();
    } catch (error) {
      return {
        data: {},
        errors: [{
          message: error instanceof Error ? error.message : 'Network error occurred',
          locations: [],
          path: []
        }],
        extensions: {},
      };
    } finally {
      inflightRequests.delete(key);
    }
  })();

  inflightRequests.set(key, promise);
  return promise;
};

export const createRelayEnvironment = () => {
  // Do not allow creation on the server
  if (typeof window === 'undefined') {
    return null;
  }

  // Return the singleton instance if it exists
  if (relayEnvironment) {
    return relayEnvironment;
  }

  try {
    relayEnvironment = new Environment({
      network: Network.create(fetchFn),
      store: new Store(new RecordSource(), {
        gcReleaseBufferSize: 10, // Keep 10 queries in memory after unmount
      }),
      isServer: false,
    });

    return relayEnvironment;
  } catch (error) {
    return null;
  }
};
