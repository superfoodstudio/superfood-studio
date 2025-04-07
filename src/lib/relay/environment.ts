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

  return await resp.json();
};

export const createRelayEnvironment = () => {
  return new Environment({
    network: Network.create(fetchFn),
    store: new Store(new RecordSource()),
  });
}; 