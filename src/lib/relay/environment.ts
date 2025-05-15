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
    return { data: null, extensions: {} };
  }

  const url = `${window.location.origin}/api/graphql`;
    
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: request.text,
        variables,
      }),
    });

    const json = await resp.json();
    
    if (json.errors) {
      console.error('GraphQL request errors:', json.errors);
    }
    
    return json;
  } catch (error) {
    console.error('Network error:', error);
    return {
      data: null,
      errors: [{ message: 'Network error occurred' }],
      extensions: {},
    };
  }
};

export const createRelayEnvironment = () => {
  // Only create the environment once in the browser
  if (typeof window === 'undefined') {
    // Server-side, return a minimal environment
    return new Environment({
      network: Network.create(() => Promise.resolve({ data: null, extensions: {} })),
      store: new Store(new RecordSource()),
    });
  }
  
  // Return the singleton instance if it exists
  if (relayEnvironment) {
    return relayEnvironment;
  }
  
  // Create the environment if it doesn't exist
  relayEnvironment = new Environment({
    network: Network.create(fetchFn),
    store: new Store(new RecordSource()),
  });
  
  return relayEnvironment;
}; 