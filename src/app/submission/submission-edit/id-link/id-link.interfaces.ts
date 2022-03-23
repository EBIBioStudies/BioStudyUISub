export interface IdentifierNamespace {
  description?: string;
  name?: string;
  prefix: string;
}

export interface IdentifierEmbedded {
  namespaces: IdentifierNamespace[];
}

export interface IdentifierResponse {
  _embedded: IdentifierEmbedded;
}

export interface IdentifierResolvedResource {
  compactIdentifierResolvedUrl: string;
}

export interface IdentifierResolverPayload {
  resolvedResources: IdentifierResolvedResource[];
}

export interface IdentifierResolverResponse {
  payload: IdentifierResolverPayload;
}
