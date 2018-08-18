import axios from 'axios';
import * as cheerio from 'cheerio';
import { DataFilePath, IMatch, ITeam } from '../models/types';
import { Crawler } from '../utils/crawler';
import { logger } from '../utils/logger';
import { Processor } from './processor';

export class MatchProcessor extends Processor<IMatch> {
    private teamMap: any;

    constructor(teamMap: any) {
        super(DataFilePath.matches);
        this.teamMap = teamMap;
    }

    public async collect(): Promise<IMatch[]> {
        try {
            const matchList: IMatch[] = [];
            const response: any = await axios.get('https://www.fifa.com/worldcup/matches');
            const $ = cheerio.load(response.data);

            // determined matches
            $('.fi-mu-list[data-matchesdate]').each((i, elem) =>
                matchList.push(this.createModel($, elem)),
            );

            // to be determined matches
            $('.fi-mu-list[data-idstage]').each((i, elem) =>
                matchList.push(this.createModel($, elem)),
            );

            // update match models from teamMap
            this.setMatches(matchList);

            // save the match list
            this.save(matchList);

            return matchList;
        } catch (e) {
            logger.error(e);
            return [];
        }
    }

    public createModel($: any, elem: any): IMatch {
        const scrapper: Crawler = new Crawler($, elem);

        // game status
        let gameStatus = 'completed';

        // goals
        const goals = scrapper.findText('.fi-s__scoreText');
        let homeTeamGoals = '0';
        let awayTeamGoals = '0';
        if (goals.indexOf('-') > -1) {
            const goalsList = goals.split('-');
            homeTeamGoals = goalsList[0];
            awayTeamGoals = goalsList[1];
        } else {
            gameStatus = 'future';
        }

        // penalties
        const penalties = scrapper.findText('.fi-mu__penaltyscore-wrap');
        let homeTeamPenalties = '0';
        let awayTeamPenalties = '0';
        if (penalties.indexOf('-') > -1) {
            const penaltyList = penalties
                .replace('(', '')
                .replace(')', '')
                .split('-');
            homeTeamPenalties = penaltyList[0];
            awayTeamPenalties = penaltyList[1];
        }

        // team country and codes
        let awayTeamCode: string = scrapper.findText('.away > .fi-t__n > .fi-t__nTri');
        let awayTeamCountry: string = scrapper.findText('.away > .fi-t__n > .fi-t__nText');
        let homeTeamCode: string = scrapper.findText('.home > .fi-t__n > .fi-t__nTri');
        let homeTeamCountry: string = scrapper.findText('.home > .fi-t__n > .fi-t__nText');
        if (awayTeamCode.length === 0) {
            awayTeamCode = 'TBD';
            awayTeamCountry = 'To Be Determined';
        }
        if (homeTeamCode.length === 0) {
            homeTeamCode = 'TBD';
            homeTeamCountry = 'To Be Determined';
        }

        const item: IMatch = {
            awayTeam: {
                code: awayTeamCode,
                country: awayTeamCountry,
                goals: awayTeamGoals,
                penalties: awayTeamPenalties,
            },
            dateTime: scrapper.findAttribute('.fi-mu__info__datetime', 'data-utcdate'),
            gameStatus,
            homeTeam: {
                code: homeTeamCode,
                country: homeTeamCountry,
                goals: homeTeamGoals,
                penalties: homeTeamPenalties,
            },
            location: scrapper.findText('.fi__info__stadium'),
            stageName: scrapper.findText('.fi__info__group'),
            time: scrapper.findText('.post_match'),
            venue: scrapper.findText('.fi__info__venue'),
        };

        if (homeTeamGoals !== awayTeamGoals) {
            if (homeTeamGoals > awayTeamGoals) {
                item.winnerCode = homeTeamCode;
            } else {
                item.winnerCode = awayTeamCode;
            }
        } else if (homeTeamPenalties !== awayTeamPenalties) {
            if (homeTeamPenalties > awayTeamPenalties) {
                item.winnerCode = homeTeamCode;
            } else {
                item.winnerCode = awayTeamCode;
            }
        }

        return item;
    }

    private setMatches(matches: IMatch[]): void {
        const updateTeam = (teamModel: ITeam, dto: ITeam, setDefaults: boolean = false) => {
            teamModel.diffGoal = dto.diffGoal;
            teamModel.draw = dto.draw;
            teamModel.goalAgainst = dto.goalAgainst;
            teamModel.goalFor = dto.goalFor;
            teamModel.lost = dto.lost;
            teamModel.matchPlayed = dto.matchPlayed;
            teamModel.points = dto.points;
            teamModel.win = dto.win;
        };
        matches.forEach(match => {
            const awayTeam = this.teamMap[match.awayTeam.code];
            if (awayTeam) {
                updateTeam(match.awayTeam, awayTeam);
            } else {
                match.awayTeam.diffGoal = '0';
                match.awayTeam.draw = '0';
                match.awayTeam.goalAgainst = '0';
                match.awayTeam.goalFor = '0';
                match.awayTeam.lost = '0';
                match.awayTeam.matchPlayed = '0';
                match.awayTeam.points = '0';
                match.awayTeam.win = '0';
            }

            const homeTeam = this.teamMap[match.homeTeam.code];
            if (homeTeam) {
                updateTeam(match.homeTeam, homeTeam);
            } else {
                match.homeTeam.diffGoal = '0';
                match.homeTeam.draw = '0';
                match.homeTeam.goalAgainst = '0';
                match.homeTeam.goalFor = '0';
                match.homeTeam.lost = '0';
                match.homeTeam.matchPlayed = '0';
                match.homeTeam.points = '0';
                match.homeTeam.win = '0';
            }
        });
    }
}
