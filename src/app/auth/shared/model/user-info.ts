export interface Aux {
  orcid: string;
}

export interface UserInfo {
  aux: Aux;
  email: string;
  fullname: string;
  secret: string;
  sessid: string;
  superuser: boolean;
  username: string | null;
  allow: string[];
  deny: string[];
}

export interface ExtendedUserInfo extends UserInfo {
  collections: string[];
}
