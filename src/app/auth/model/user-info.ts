export interface Aux {
    orcid: string
}

export interface UserInfo {
    sessid: string,
    username: string,
    email: string,
    superuser: boolean,
    secret: string,
    aux: Aux,
    projects: string[]
}
