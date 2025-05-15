import { GraphQLTaggedNode, RelayContext } from 'relay-runtime';

// Declare module for graphql tagged template literal
declare module 'relay-runtime' {
  interface GeneratedNodeMap {
    [key: string]: GraphQLTaggedNode;
  }
}

// Extensions to help with fragment references
declare global {
  // This will ensure proper typing for generated fragment reference props
  interface FragmentRefs {
    readonly ' $fragmentSpreads': any;
  }

  // Helper type to extract fragment data
  type FragmentType<TKey extends string> = {
    readonly [key in TKey]: FragmentRefs;
  };
}

// Export the fragment reference type
export type FragmentRef<T extends {}> = T & FragmentRefs;

// Utility to extract the data type of a fragment from the generated types
export type ExtractFragment<TKey extends string, TFragmentData> = 
  (props: { [key in TKey]: TFragmentData }) => React.ReactElement | null; 