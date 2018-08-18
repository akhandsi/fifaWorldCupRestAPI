export enum DataFilePath {
    matches = 'server/data/matches.json',
    standings = 'server/data/standings.json',
    statistics = 'server/data/statistics.json',
    teams = 'server/data/teams.json',
}

export interface IMessage {
    message: string;
}

export interface IModel {
    id?: string;
}

export interface ITeamInfo {
    code: string;
    country: string;
}

export interface ITeam extends ITeamInfo, IModel {
    diffGoal?: string;
    draw?: string;
    goalAgainst?: string;
    goalFor?: string;
    lost?: string;
    matchPlayed?: string;
    points?: string;
    win?: string;
    goals?: string;
    penalties?: string;
}

export interface IPlayer extends IModel {
    assist?: string;
    countryCode: string;
    goalsSaveRate?: string;
    goalsSaved?: string;
    goalsScored?: string;
    matchesPlayed: string;
    minutesPlayed: string;
    name: string;
    playerId: string;
    penaltiesScored?: string;
    rank: string;
    country?: string;
}

export interface IStatistics extends IModel {
    goalsSavedStats: IPlayer[];
    goalsScoredStats: IPlayer[];
}

export interface IStanding extends IModel {
    groupName: string;
    teams: ITeam[];
}

export interface IMatch extends IModel {
    awayTeam: ITeam;
    dateTime: string;
    gameStatus: string;
    homeTeam: ITeam;
    location: string;
    stageName: string;
    time: string;
    venue: string;
    winnerCode?: string;
}
