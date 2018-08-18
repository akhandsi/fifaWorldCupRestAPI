import { Controller, Get } from '@tsed/common';
import * as express from 'express';
import { IMatch, IStanding, IStatistics, ITeam, ITournamentInfo } from '../models/types';
import { WebCrawlerService } from '../service/webCrawlerService';

@Controller('/fifa')
export class FifaController {
    @Get('/tournamentInfo')
    public async getTournamentInfo(
        req: express.Request,
        res: express.Response,
    ): Promise<ITournamentInfo[]> {
        return await WebCrawlerService.getTournamentInfo();
    }

    @Get('/teams')
    public async getTeams(req: express.Request, res: express.Response): Promise<ITeam[]> {
        return await WebCrawlerService.getTeams();
    }

    @Get('/matches')
    public async getMatches(req: express.Request, res: express.Response): Promise<IMatch[]> {
        return await WebCrawlerService.getMatches();
    }

    @Get('/standings')
    public async getStandings(req: express.Request, res: express.Response): Promise<IStanding[]> {
        return await WebCrawlerService.getStandings();
    }

    @Get('/statistics')
    public async getStatistics(
        req: express.Request,
        res: express.Response,
    ): Promise<IStatistics[]> {
        return await WebCrawlerService.getStatistics();
    }
}
