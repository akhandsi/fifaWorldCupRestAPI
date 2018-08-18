import axios from 'axios';
import * as cheerio from 'cheerio';
import { DataFilePath, IStanding, ITeam } from '../models/types';
import { Crawler } from '../utils/crawler';
import { logger } from '../utils/logger';
import { Processor } from './processor';

export class StandingProcessor extends Processor<IStanding> {
    constructor() {
        super(DataFilePath.standings);
    }

    /**
     * Collect standings by going through the groups list
     * @returns list of team standings
     */
    public async collect(): Promise<IStanding[]> {
        try {
            const standings: IStanding[] = [];
            const response: any = await axios.get('https://www.fifa.com/worldcup/groups');
            const $ = cheerio.load(response.data);

            // gather all group standings
            $('.fi-table.fi-standings').each((i, elem) =>
                standings.push(this.createModel($, elem)),
            );

            // save data to json
            this.save(standings);

            return standings;
        } catch (e) {
            logger.error(e);
            return [];
        }
    }

    /**
     * Create a standing model by scrapping html
     * @returns team standing
     */
    public createModel($: any, elem: any): IStanding {
        const scrapper: Crawler = new Crawler($, elem);

        const teams: ITeam[] = [];
        const groupName = scrapper.findText('.fi-table__caption__title');

        // find each team in the group
        scrapper.findSelections('tr[data-team-id]').each((i, trElem) => {
            const trScrapper = new Crawler($, trElem);
            teams.push({
                code: trScrapper.findText('.fi-table__teamname > .fi-t > .fi-t__n > .fi-t__nTri'),
                country: trScrapper.findText(
                    '.fi-table__teamname > .fi-t > .fi-t__n > .fi-t__nText',
                ),
                diffGoal: trScrapper.findText('.fi-table__diffgoal > .text'),
                draw: trScrapper.findText('.fi-table__draw > .text'),
                goalAgainst: trScrapper.findText('.fi-table__goalagainst > .text'),
                goalFor: trScrapper.findText('.fi-table__goalfor > .text'),
                lost: trScrapper.findText('.fi-table__lost > .text'),
                matchPlayed: trScrapper.findText('.fi-table__matchplayed > .text'),
                points: trScrapper.findText('.fi-table__pts > .text'),
                win: trScrapper.findText('.fi-table__win > .text'),
            });
        });

        return { groupName, teams };
    }
}
