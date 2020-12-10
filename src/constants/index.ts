export const Events: any = {
    CREATED: "match_object_created",
    CONFIGURING: "match_status_configuring",
    READY: "match_status_ready",
    FINISHED: "match_status_finished",
    CANCELLED: "match_status_cancelled"
}

export const MatchStatus: any = {
    LIVE: "LIVE",
    FINISHED: "FINISHED"
}

export const mapsImages:{[index:string]:any} = {
    "de_vertigo": "https://assets.faceit-cdn.net/third_party/games/4f899245-2fa8-4e52-ad9a-4a363613c19e/assets/votables/973a97e8-680b-4e78-ae80-f18b0cb22f17_1589578674213.jpeg",
    "de_inferno": "https://assets.faceit-cdn.net/third_party/games/4f899245-2fa8-4e52-ad9a-4a363613c19e/assets/votables/696875d8-f504-44ff-9f4f-26bd81a237fe_1589575508999.jpeg",
    "de_train": "https://assets.faceit-cdn.net/third_party/games/4f899245-2fa8-4e52-ad9a-4a363613c19e/assets/votables/92a510c3-5c87-49fe-b37c-e4629a91475f_1589195852968.jpeg",
    "de_overpass": "https://assets.faceit-cdn.net/third_party/games/4f899245-2fa8-4e52-ad9a-4a363613c19e/assets/votables/0fe0aa60-193e-4f0b-aa8a-64d3388291bf_1589195875398.jpeg",
    "de_nuke": "https://assets.faceit-cdn.net/third_party/games/4f899245-2fa8-4e52-ad9a-4a363613c19e/assets/votables/2d11b059-8dc0-4b27-af45-383bb1f2edb3_1589578450447.jpeg",
    "de_mirage": "https://assets.faceit-cdn.net/third_party/games/4f899245-2fa8-4e52-ad9a-4a363613c19e/assets/votables/b846f806-1957-4456-952e-e0f85233b5d7_1589195893467.jpeg",
    "de_dust2": "https://assets.faceit-cdn.net/third_party/games/4f899245-2fa8-4e52-ad9a-4a363613c19e/assets/votables/ea89f284-db87-48e4-a492-fee976f40149_1589575282787.jpeg",
    "de_cache": "https://assets.faceit-cdn.net/third_party/games/4f899245-2fa8-4e52-ad9a-4a363613c19e/assets/votables/b7b9388c-a5ad-44a0-8b80-145113dfe573_1589578263519.jpeg"
}

export const maps: string[] = [
    'de_cache',
    'de_dust2',
    'de_mirage',
    'de_nuke',
    'de_overpass',
    'de_inferno',
    'de_vertigo',
    'de_train'
]

// Converts player matches to readable format
export const FaceitIndex: any = {
    "m1": "Matches",
    "m2": "Wins",
    "m3": "Kills",
    "m4": "Deaths",
    "m5": "Assists",
    "m6": "MVPs",
    "m7": "K/D Ratio",
    "m8": "Rounds",
    "m9": "Headshots",
    "m10": "Triple Kills",
    "m11": "Quadro Kills",
    "m12": "Penta Kills",
    "m13": "Total Headshots %",
    "m14": "K/R Ratio",
    "k1": "Average Kills",
    "k2": "Average Deaths",
    "k3": "Average Assists",
    "k4": "Average MVPs",
    "k5": "Average K/D Ratio",
    "k6": "Win Rate %",
    "k8": "Average Headshots %",
    "k9": "Average K/R Ratio",
    "k10": "Average Triple Kills",
    "k11": "Average Quadro Kills",
    "k12": "Average Penta Kills",
    "s0": "List of results",
    "s1": "Penta Kills",
    "s2": "Longest Win Streak",
    // "s3": null,
    // "s4": null,
    // "s5": null,
    // "s6": null,
    // "s7": null,
    // "c1": null,
    "c2": "K/D",
    "c3": "K/R",
    "c4": "HS %",
    "c5": "Final Score",
    "i0": "Region",
    "i1": "Map",
    "i2": "Map ID",
    "i3": "First Half Score",
    "i4": "Second Half Score",
    "i5": "Team Name",
    "i6": "Kills",
    "i7": "Assists",
    "i8": "Deaths",
    "i9": "MVPs",
    "i10": "Result", // 1-win 0-loss
    // "i11": null,
    "i12": "Rounds",
    "i13": "HS",
    "i14": "Tripple Kills",
    "i15": "Quadro Kills",
    "i16": "Penta Kills",
    "i18": "Final Score",
    // "i19": null,
}

export const average_allowed: any = [
    "Kills", "Deaths", "Assists", "HS", "K/D", "K/R", 
]