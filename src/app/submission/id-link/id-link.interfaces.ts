export interface IdentifierNamespace {
  prefix: string;
  name?: string;
  description?: string;
}

export interface IdentifierEmbedded {
  namespaces: IdentifierNamespace[]
}

export interface IdentifierResponse {
  _embedded: IdentifierEmbedded
}
