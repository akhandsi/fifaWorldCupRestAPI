import { IMatch, IStanding, IStatistics, ITeam, ITeamInfo, ITournamentInfo } from '../models/types';
import { logger } from '../utils/logger';
import { MatchProcessor } from './matchProcessor';
import { StandingProcessor } from './standingProcessor';
import { StatisticsProcessor } from './statisticsProcessor';
import { TeamProcessor } from './teamProcessor';
import { TournamentInfoProcessor } from './tournamentInfoProcessor';

export class WebCrawlerService {
    public static getTournamentInfo(): ITournamentInfo[] {
        return new TournamentInfoProcessor().read();
    }

    public static getTeams(): ITeam[] {
        return new TeamProcessor([]).read();
    }

    public static getMatches(): IMatch[] {
        return new MatchProcessor({}).read();
    }

    public static getStandings(): IStanding[] {
        return new StandingProcessor().read();
    }

    public static getStatistics(): IStatistics[] {
        return new StatisticsProcessor({}).read();
    }

    public static shouldCollect(): boolean {
        const tournamentInfo: ITournamentInfo[] = WebCrawlerService.getTournamentInfo();

        if (!tournamentInfo[0] || !tournamentInfo[0].endDate) {
            return false;
        }

        const currentDate: Date = new Date();
        const tournamentEndDate: Date = new Date(tournamentInfo[0].endDate || '');
        return tournamentEndDate > currentDate;
    }

    public static async collect(): Promise<ITeamInfo[]> {
        try {
            let teams: ITeam[];

            // only crawl if tournament is still going on
            // else only return cached teams
            if (WebCrawlerService.shouldCollect()) {
                // wait to get tournament information
                await WebCrawlerService.collectTournamentInfo();

                // wait to get standings and extract teams
                const standings: IStanding[] = await WebCrawlerService.collectStandings();

                // wait to get teams and extract teamMap
                teams = await WebCrawlerService.collectTeams(standings);

                // we can collect statistics in parallel
                // because we have already collected teams information
                WebCrawlerService.collectStatistics().catch(err => logger.error(err));

                // we can collect matches in parallel
                // because we have already collected teams information
                WebCrawlerService.collectMatches().catch(err => logger.error(err));
            } else {
                teams = WebCrawlerService.getTeams();
            }

            // return list of team info
            return teams.map(team => {
                return {
                    code: team.code,
                    country: team.country,
                };
            });
        } catch (e) {
            logger.error(e);
            return [];
        }
    }

    private static teamMap: any;

    private static async collectTournamentInfo(): Promise<ITournamentInfo[]> {
        try {
            const processor = new TournamentInfoProcessor();
            return await processor.collect();
        } catch (e) {
            logger.error(e);
            return [];
        }
    }

    private static async collectStatistics(): Promise<IStatistics[]> {
        try {
            const processor = new StatisticsProcessor(WebCrawlerService.teamMap);
            return await processor.collect();
        } catch (e) {
            logger.error(e);
            return [];
        }
    }

    private static async collectMatches(): Promise<IMatch[]> {
        try {
            const processor = new MatchProcessor(WebCrawlerService.teamMap);
            return await processor.collect();
        } catch (e) {
            logger.error(e);
            return [];
        }
    }

    private static async collectStandings(): Promise<IStanding[]> {
        try {
            const processor = new StandingProcessor();
            return await processor.collect();
        } catch (e) {
            logger.error(e);
            return [];
        }
    }

    private static async collectTeams(standings: IStanding[]): Promise<ITeam[]> {
        try {
            const processor = new TeamProcessor(standings);
            const teams: ITeam[] = await processor.collect();
            WebCrawlerService.teamMap = processor.getTeamMap();
            return teams;
        } catch (e) {
            logger.error(e);
            return [];
        }
    }
}
