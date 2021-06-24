export const environment = {
  production: true,
  ingestApiUrl: 'https://api.ingest.archive.data.humancellatlas.org',
  catalogueEndpoint: '/projects/search/catalogue?page=0&size=500',
  wranglerEmail: 'wrangler-team@data.humancellatlas.org',
  wranglerOntology: 'EFO:0009737',
  // GitHub PAT for accessing the projects index repo
  // IMPORTANT! This PAT should ONLY have the `public_repo` scopes
  // Guide for creating a PAT:
  // https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token
  gh_pat: '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',
};
