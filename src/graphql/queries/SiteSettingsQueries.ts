import { graphql } from 'relay-runtime';

export const SiteSettingsQuery = graphql`
  query SiteSettingsQueriesQuery {
    siteSettings {
      id
      homepageVideoUrl
      weeklyGroceryList
      createdAt
      updatedAt
    }
  }
`;

export const UpdateSiteSettingsMutation = graphql`
  mutation SiteSettingsQueriesUpdateMutation($input: UpdateSiteSettingsInput!) {
    updateSiteSettings(input: $input) {
      id
      homepageVideoUrl
      weeklyGroceryList
      createdAt
      updatedAt
    }
  }
`;