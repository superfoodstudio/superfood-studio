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
    console.warn('Relay fetch attempted during server render - returning empty data');
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
      body: JSON.stringify({
        query: request.text,
        variables,
      }),
    });

    if (!resp.ok) {
      throw new Error(`Network error, status: ${resp.status}`);
    }

    const json = await resp.json();
    
    if (json.errors) {
      console.error('GraphQL request errors:', json.errors);
    }
    
    return json;
  } catch (error) {
    console.error('Network error:', error);
    
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
  // Ensure we're in the browser
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Return the singleton instance if it exists
  if (relayEnvironment) {
    return relayEnvironment;
  }
  
  // Create the environment if it doesn't exist
  relayEnvironment = new Environment({
    network: Network.create(fetchFn),
    store: new Store(new RecordSource()),
    isServer: false,
  });
  
  return relayEnvironment;
}; 