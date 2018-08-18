import { DataFilePath, IMatch, IStanding, ITeam } from '../models/types';
import { Processor } from './processor';

export class TeamProcessor extends Processor<ITeam> {
    private teamMap: any = {};
    private standings: IStanding[];

    constructor(standings: IStanding[]) {
        super(DataFilePath.matches);
        this.standings = standings;
    }

    public async collect(): Promise<ITeam[]> {
        let teams: ITeam[] = [];
        this.standings.forEach(standing => (teams = teams.concat(standing.teams)));
        teams.forEach(team => (this.teamMap[team.code] = team));

        // save teams
        this.save(teams);

        return teams;
    }

    public getTeamMap(): any {
        return this.teamMap;
    }
}
