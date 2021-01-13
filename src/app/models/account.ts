export interface Account {
    $id: string;
    email: string;
    emailVerification: boolean;
    name: string;
    registration: number;
    roles: string[];
    prefs: AccountPreference;

}

export interface AccountPreference {
    [key: string]: any;
}