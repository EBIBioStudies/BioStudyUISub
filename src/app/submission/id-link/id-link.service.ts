import * as HttpStatus from 'http-status-codes';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  IdentifierEmbedded,
  IdentifierNamespace,
  IdentifierResponse,
  IdentifierResolverResponse,
  IdentifierResolverPayload,
  IdentifierResolvedResource
} from './id-link.interfaces';
import { formatString } from 'app/utils/string.utils';

@Injectable()
export class IdLinkService {
  static REGISTRY_URL: string = '/identifiers/registry'; // base URL for the service endpoint
  static RESOLUTION_URL: string = '/identifiers/resolver';

  // These links are taken from https://github.com/EBIBioStudies/ribs/blob/master/src/main/webapp/js/detail/detailpage.js
  // Any update in these links should be applied in the source and vice versa.
  private prefixToLinkMap = {
    pmc: 'https://europepmc.org/articles/{0}',
    pmid: 'https://europepmc.org/abstract/MED/{0}',
    doi: 'https://dx.doi.org/{0}',
    chembl: 'https://www.ebi.ac.uk/chembldb/compound/inspect/{0}',
    ega: 'https://www.ebi.ac.uk/ega/studies/{0}',
    uniprot: 'http://www.uniprot.org/uniprot/{0}',
    ena: 'https://www.ebi.ac.uk/ena/browser/view/{0}',
    'array design': 'https://www.ebi.ac.uk/biostudies/arrayexpress/studies/{0}',
    'arrayexpress files': 'https://www.ebi.ac.uk/biostudies/arrayexpress/studies/{0}/files/',
    arrayexpress: 'https://www.ebi.ac.uk/arrayexpress/experiments/{0}',
    dbsnp: 'http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs={0}',
    pdbe: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/{0}/summary',
    pfam: 'http://pfam.xfam.org/family/{0}',
    omim: 'http://omim.org/entry/{0}',
    interpro: 'https://www.ebi.ac.uk/interpro/entry/{0}',
    nucleotide: 'http://www.ncbi.nlm.nih.gov/nuccore/{0}',
    geo: 'http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc={0}',
    intact: 'https://www.ebi.ac.uk/intact/interaction/{0}',
    biostudies: 'https://www.ebi.ac.uk/biostudies/studies/{0}',
    'biostudies title': 'https://www.ebi.ac.uk/biostudies/studies?first&query=title%3A%22{0}%22',
    'biostudies search': 'https://www.ebi.ac.uk/biostudies/studies?query={0}',
    go: 'http://amigo.geneontology.org/amigo/term/{0}',
    chebi: 'https://www.ebi.ac.uk/chebi/searchId.do?chebiId={0}',
    bioproject: 'https://www.ncbi.nlm.nih.gov/bioproject/{0}',
    biosamples: 'https://www.ebi.ac.uk/biosamples/samples/{0}',
    chemagora: 'http://chemagora.jrc.ec.europa.eu/chemagora/inchikey/{0}',
    compound: 'https://www.ebi.ac.uk/biostudies/studies/{0}',
    rfam: 'http://rfam.org/family/{0}',
    rnacentral: 'http://rnacentral.org/rna/{0}',
    nct: 'https://clinicaltrials.gov/ct2/show/{0}',
    'expression atlas': 'https://www.ebi.ac.uk/gxa/experiments/{0}?ref=biostudies',
    'expression atlas (single cell)': 'https://www.ebi.ac.uk/gxa/sc/experiments/{0}?ref=biostudies',
    idr: 'https://idr.openmicroscopy.org/search/?query=Name:{0}',
    empiar: 'https://www.ebi.ac.uk/pdbe/emdb/empiar/entry/{0}/'
  };

  private biostudiesPrefixes = Object.keys(this.prefixToLinkMap);

  idUrl: string | undefined; // last URL for valid identifier
  prefixes: string[] = []; // all possible prefixes for formatted links

  /**
   * Caches the list of all prefixes, signalling when it's been retrieved and available.
   * @param http - Client HTTP API.
   */
  constructor(private http: HttpClient) {}

  /**
   * Pseudonym for the "suggest" method without parameters to retrieve the complete list of prefixes.
   */
  list(): Observable<string[]> {
    return this.suggest();
  }

  /**
   * Retrieves the list of identifier prefixes matching the user-defined partial string.
   * @param [prefix] - Partial prefix for identifier. If not provided, the full list is retrieved.
   * @returns Observable the request has been turned into.
   */
  suggest(prefix?: string): Observable<string[]> {
    let url;

    if (typeof prefix === 'undefined' || prefix.length === 0 || this.prefixes.length === 0) {
      url = `${IdLinkService.REGISTRY_URL}/namespaces`;
    } else {
      const matches =
        prefix && prefix.length > 0
          ? this.prefixes.filter((internalPrefix) => internalPrefix.toLowerCase().includes(prefix.toLowerCase()))
          : this.prefixes;

      return of(matches);
    }

    return this.http.get(url).pipe(
      map((data: IdentifierResponse) => {
        const embedded: IdentifierEmbedded = data._embedded || {};
        const namespaces: IdentifierNamespace[] = embedded.namespaces || [];

        const identifiersPrefixes = namespaces.map((namespace) => {
          return namespace.prefix === 'chebi' ? namespace.prefix.toUpperCase() : namespace.prefix;
        });

        this.prefixes = Array.from(new Set([...identifiersPrefixes, ...this.biostudiesPrefixes])).sort();

        return this.prefixes;
      }),
      catchError((err) => {
        if (err.status === HttpStatus.NOT_FOUND) {
          return of([]);
        }
        return throwError(err);
      })
    );
  }

  /**
   * Checks if a prefix:id string is among the allowed ones.
   *
   * @param identifier - Identifier to be validated against identifiers.org.
   * @returns Observable the request has been turned into.
   */
  resolve(identifier: string): Observable<IdentifierResolvedResource> {
    const [prefix, value] = identifier.split(':');
    const internalPrefix = this.biostudiesPrefixes.find(
      (prefixItem) => prefixItem.toLowerCase() === prefix.toLowerCase()
    );

    if (internalPrefix) {
      const prefixLink = this.prefixToLinkMap[internalPrefix];
      const formattedLink = formatString(prefixLink, value);

      return of({ compactIdentifierResolvedUrl: formattedLink });
    }

    return this.http.get(`${IdLinkService.RESOLUTION_URL}/${identifier}`).pipe(
      map((response: IdentifierResolverResponse) => {
        const payload: IdentifierResolverPayload = response.payload || {};
        const resolvedResources: IdentifierResolvedResource = payload.resolvedResources[0] || {};

        return resolvedResources;
      }),
      catchError((err) => {
        if (err.status === HttpStatus.BAD_REQUEST) {
          return throwError(`INVALID resolution request for ${identifier}`);
        }

        return throwError(err);
      })
    );
  }
}
