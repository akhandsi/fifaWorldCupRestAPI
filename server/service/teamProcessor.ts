import { DataFilePath, IMatch, IStanding, ITeam } from '../models/types';
import { Processor } from './processor';

export class TeamProcessor extends Processor<ITeam> {
    private teamMap: any = {};
    private standings: IStanding[];

    /**
     * Teams are collected from standings
     * @param standings
     */
    constructor(standings: IStanding[]) {
        super(DataFilePath.teams);
        this.standings = standings;
    }

    /**
     * Collect teams by going through the standings
     * @returns list of teams
     */
    public async collect(): Promise<ITeam[]> {
        let teams: ITeam[] = [];
        this.standings.forEach(standing => (teams = teams.concat(standing.teams)));
        teams.forEach(team => (this.teamMap[team.code] = team));

        // save teams
        this.save(teams);

        return teams;
    }

    /**
     * Getter for teamMap
     * @returns teamMap
     */
    public getTeamMap(): any {
        return this.teamMap;
    }
}
