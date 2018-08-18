import axios from 'axios';
import * as cheerio from 'cheerio';
import { DataFilePath, IPlayer, IStatistics } from '../models/types';
import { Crawler } from '../utils/crawler';
import { logger } from '../utils/logger';
import { Processor } from './processor';

export class StatisticsProcessor extends Processor<IStatistics> {
    private teamMap: any;

    constructor(teamMap: any) {
        super(DataFilePath.statistics);
        this.teamMap = teamMap;
    }

    /**
     * Collect statistics by going through the players list of goals scored and saved
     * @returns list of player statistics
     */
    public async collect(): Promise<IStatistics[]> {
        try {
            let $;
            const tableSelector = '.fi-table.fi-statistics-players';

            // gather all goals scored - player ranking
            const goalsScoredStats: IPlayer[][] = [];
            const goalScoreResponse: any = await axios.get(
                'https://www.fifa.com/worldcup/statistics/players/goal-scored',
            );
            $ = cheerio.load(goalScoreResponse.data);
            $(tableSelector).each((i, elem) =>
                goalsScoredStats.push(this.createGoalScorerModel($, elem)),
            );

            // gather all goals saved - player ranking
            const goalsSavedStats: IPlayer[][] = [];
            const goalSavedResponse = await axios.get(
                'https://www.fifa.com/worldcup/statistics/players/saves',
            );
            $ = cheerio.load(goalSavedResponse.data);
            $(tableSelector).each((i, elem) =>
                goalsSavedStats.push(this.createGoalSaverModel($, elem)),
            );

            const statistics: IStatistics[] = [
                {
                    goalsSavedStats: goalsSavedStats[0],
                    goalsScoredStats: goalsScoredStats[0],
                },
            ];

            statistics[0].goalsScoredStats.forEach(player => {
                player.country = this.teamMap[player.countryCode].country;
            });
            statistics[0].goalsSavedStats.forEach(player => {
                player.country = this.teamMap[player.countryCode].country;
            });

            // save the statistics list
            this.save(statistics);

            return statistics;
        } catch (e) {
            logger.error(e);
            return [
                {
                    goalsSavedStats: [],
                    goalsScoredStats: [],
                },
            ];
        }
    }

    /**
     * Create a player who scored goals by scrapping html
     * @returns player
     */
    private createGoalScorerModel($: any, elem: any): IPlayer[] {
        const scrapper: Crawler = new Crawler($, elem);

        const players: IPlayer[] = [];

        // find each player
        scrapper.findSelections('tr[data-team-id]').each((i, trElem) => {
            const trScrapper = new Crawler($, trElem);
            const countryCode = trScrapper.findAttribute(
                '.fi-table__playername > a > div > div.fi-p__picture > div > div > img',
                'title',
            );
            players.push({
                assist: trScrapper.findText('td.fi-table__td:nth-child(4) > span'),
                countryCode: countryCode === 'GBR' ? 'ENG' : countryCode,
                goalsScored: trScrapper.findText('td.fi-table__td:nth-child(3) > span'),
                matchesPlayed: trScrapper.findText('td.fi-table__td:nth-child(6) > span'),
                minutesPlayed: trScrapper.findText('td.fi-table__td:nth-child(5) > span'),
                name: trScrapper.findText(
                    '.fi-table__playername > a > div > div.fi-p__wrapper-text > div.fi-p__name',
                ),
                penaltiesScored: trScrapper.findText('td.fi-table__td:nth-child(7) > span'),
                playerId: trScrapper.findAttribute(
                    'td.fi-table__playername.teamname-nolink > a',
                    'data-player-id',
                ),
                rank: trScrapper.findText('td.fi-table__rank'),
            });
        });

        return players;
    }

    /**
     * Create a player who saved goals by scrapping html
     * @returns player
     */
    private createGoalSaverModel($: any, elem: any): IPlayer[] {
        const scrapper: Crawler = new Crawler($, elem);
        const players: IPlayer[] = [];

        // find each player
        scrapper.findSelections('tr[data-team-id]').each((i, trElem) => {
            const trScrapper: Crawler = new Crawler($, trElem);
            const countryCode = trScrapper.findAttribute(
                '.fi-table__playername > a > div > div.fi-p__picture > div > div > img',
                'title',
            );
            players.push({
                countryCode: countryCode === 'GBR' ? 'ENG' : countryCode,
                goalsSaveRate: trScrapper.findText('td.fi-table__td:nth-child(6) > span'),
                goalsSaved: trScrapper.findText('td.fi-table__td:nth-child(5) > span'),
                matchesPlayed: trScrapper.findText('td.fi-table__td:nth-child(3) > span'),
                minutesPlayed: trScrapper.findText('td.fi-table__td:nth-child(4) > span'),
                name: trScrapper.findText(
                    '.fi-table__playername > a > div > div.fi-p__wrapper-text > div.fi-p__name',
                ),
                playerId: trScrapper.findAttribute(
                    'td.fi-table__playername.teamname-nolink > a',
                    'data-player-id',
                ),
                rank: trScrapper.findText('td.fi-table__rank'),
            });
        });

        return players;
    }
}
