export interface VatgerUserData {
    discord_id: string,
    is_vatger_member: boolean,
    is_vatger_fullmember: boolean,
    atc_rating: number | null,
    pilot_rating: number | null,
    teams: string[]

}

export interface VatgerUserUpdateData {
    cid: number,
    discord_id: string,
}