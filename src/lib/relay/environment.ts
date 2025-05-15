import { 
  Environment, 
  Network, 
  RecordSource, 
  Store,
  FetchFunction,
  RequestParameters,
  Variables
} from 'relay-runtime';

const fetchFn: FetchFunction = async (
  request: RequestParameters, 
  variables: Variables
) => {
  const url = typeof window !== 'undefined' 
    ? `${window.location.origin}/api/graphql` 
    : 'http://localhost:3000/api/graphql';
    
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
    };
  }
};

export const createRelayEnvironment = () => {
  return new Environment({
    network: Network.create(fetchFn),
    store: new Store(new RecordSource()),
  });
}; 