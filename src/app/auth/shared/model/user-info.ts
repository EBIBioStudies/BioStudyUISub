export interface UserInfo {
  allow: string[];
  orcid: string;
  deny: string[];
  email: string;
  fullname: string;
  secret: string;
  sessid: string;
  superuser: boolean;
  username: string | null;
  uploadType: string | null;
}

export interface ExtendedUserInfo extends UserInfo {
  collections: string[];
}
