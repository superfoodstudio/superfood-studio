import { Environment, Network, RecordSource, Store } from 'relay-runtime';

const fetchFn = async (request: Request, variables: Record<string, unknown>) => {
  const resp = await fetch('/api/graphql', {
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