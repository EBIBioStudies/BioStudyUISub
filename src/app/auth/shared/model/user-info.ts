export interface Aux {
  orcid: string;
}

export interface UserInfo {
  allow: string[];
  aux: Aux;
  deny: string[];
  email: string;
  fullname: string;
  secret: string;
  sessid: string;
  superuser: boolean;
  username: string | null;
}

export interface ExtendedUserInfo extends UserInfo {
  collections: string[];
}
