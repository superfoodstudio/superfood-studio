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

const fetchFn: FetchFunction = async (
  request: RequestParameters, 
  variables: Variables
) => {
  // Ensure we're in browser environment
  if (typeof window === 'undefined') {
    return { data: {}, errors: [], extensions: {} };
  }

  const url = `${window.location.origin}/api/graphql`;
    
  try {
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
        Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for authentication
    body: JSON.stringify({
      query: request.text,
      variables,
    }),
  });

    if (!resp.ok) {
      throw new Error(`Network error, status: ${resp.status}`);
    }

    const json = await resp.json();
    
    
    return json;
  } catch (error) {
    // Return a structured error response that Relay can handle
    return {
      data: {},
      errors: [{ 
        message: error instanceof Error ? error.message : 'Network error occurred',
        locations: [],
        path: []
      }],
      extensions: {},
    };
  }
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
    // Create the environment if it doesn't exist
    relayEnvironment = new Environment({
    network: Network.create(fetchFn),
    store: new Store(new RecordSource()),
      isServer: false,
  });
    
    return relayEnvironment;
  } catch (error) {
    return null;
  }
}; 