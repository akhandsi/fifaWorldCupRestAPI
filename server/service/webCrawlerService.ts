import { IMatch, IStanding, IStatistics, ITeam, ITeamInfo } from '../models/types';
import { logger } from '../utils/logger';
import { MatchProcessor } from './matchProcessor';
import { StandingProcessor } from './standingProcessor';
import { StatisticsProcessor } from './statisticsProcessor';
import { TeamProcessor } from './teamProcessor';

export class WebCrawlerService {
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

    public static async collect(): Promise<ITeamInfo[]> {
        try {
            // wait to get standings and extract teams
            const standings: IStanding[] = await WebCrawlerService.collectStandings();

            // wait to get teams and extract teamMap
            const teams: ITeam[] = await WebCrawlerService.collectTeams(standings);

            // we can collect statistics in parallel
            // because we have already collected teams information
            WebCrawlerService.collectStatistics().catch(err => logger.error(err));

            // we can collect matches in parallel
            // because we have already collected teams information
            WebCrawlerService.collectMatches().catch(err => logger.error(err));

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
