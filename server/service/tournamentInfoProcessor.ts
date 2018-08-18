import axios from 'axios';
import * as cheerio from 'cheerio';
import { DataFilePath, ITournamentInfo } from '../models/types';
import { Crawler } from '../utils/crawler';
import { logger } from '../utils/logger';
import { Processor } from './processor';

export class TournamentInfoProcessor extends Processor<ITournamentInfo> {
    constructor() {
        super(DataFilePath.tournamentInfo);
    }

    /**
     * Collect tournament info
     * @returns tournament information about startDate, endDate and title
     */
    public async collect(): Promise<ITournamentInfo[]> {
        try {
            const tournamentInfo: ITournamentInfo[] = [];
            const response: any = await axios.get('https://www.fifa.com/worldcup/');
            const $ = cheerio.load(response.data);

            // gather the worldcup body
            $('.worldcup').each((i, elem) => tournamentInfo.push(this.createModel($, elem)));

            // save data to json
            this.save(tournamentInfo);

            return tournamentInfo;
        } catch (e) {
            logger.error(e);
            return [];
        }
    }

    /**
     * Create a tournamentInfo model by scrapping html
     * @returns tournament info
     */
    public createModel($: any, elem: any): ITournamentInfo {
        const scrapper: Crawler = new Crawler($, elem);

        // scrap html to get title and dateRange
        const tournamentTitle: string = scrapper.findText('a.fi-section-header__competition > h1');
        const tournamentDateRange: string = scrapper.findText(
            'a.fi-section-header__competition > p',
        );

        // extract year from tournament title
        const yearRegex: RegExp = /\b(19|20)\d{2}\b/g;
        const yearMatch: RegExpExecArray | null = yearRegex.exec(tournamentTitle);

        // return empty object if we get null for year match
        if (yearMatch === null) {
            return {
                endDate: null,
                startDate: null,
                title: null,
            };
        }

        // construct tournament info model
        const tournamentDates: string[] = tournamentDateRange.split(' - ');
        return {
            endDate: `${tournamentDates[1]} ${yearMatch[0]}`,
            startDate: `${tournamentDates[0]} ${yearMatch[0]}`,
            title: tournamentTitle,
        };
    }
}
