export interface Settings {
    active: boolean,
    app_id: string,
    created_at: string,
    custom: boolean,
    events: string[],
    id: string,
    name: string,
    public: boolean,
    restrictions: object[],
    scale: boolean,
    third_party_id: string,
    tokens: { header_name: string, header_value: string, query_name: string, query_value: string }
    type: string,
    updated_at: string,
    url: string,
}

export interface Team {
    id: string,
    name: string,
    type: string,
    avatar: string,
    leader_id: string,
    co_leader_id: string,
    roster: Player[],
    substitutions: number,
    substitutes?: null
}

export interface Player {
    id: string,
    nickname: string,
    avatar: string,
    game_id: string,
    game_name: string,
    game_skill_level: number,
    membership: string,
    anticheat_required: boolean
}

export interface Match{
    id: string,
    organizer_id: string,
    region: string,
    game: string,
    version: number,
    entity: {
        id: string,
        name: string,
        type: string
    },
    teams?: Team[]
    created_at: string,
    updated_at: string
}

export interface Hook {
    transaction_id: string,
    event: string,
    event_id: string,
    third_party_id: string,
    app_id: string,
    timestamp: string,
    retry_count: number,
    version: number,
    payload: Match
}