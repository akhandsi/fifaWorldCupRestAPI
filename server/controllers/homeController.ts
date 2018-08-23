import { Controller, Post } from '@tsed/common';
import * as express from 'express';
import * as cron from 'node-cron';
import { ITeamInfo } from '../models/types';
import { WebCrawlerService } from '../service/webCrawlerService';
import { logger } from '../utils/logger';
import ScheduledTask = cron.ScheduledTask;

@Controller('/home')
export class HomeController {
    public crawlingInProgress: boolean = false;
    private crawlingProcess: ScheduledTask;

    constructor() {
        this.crawlSetup();
    }

    @Post('/collect')
    public async collect(req: express.Request, res: express.Response): Promise<ITeamInfo[]> {
        return await WebCrawlerService.collect();
    }

    private crawlSetup(): void {
        // if crawlingProcess exists destroy it
        if (this.crawlingProcess) {
            this.crawlingProcess.destroy();
        }

        // create new monitoringProcess
        this.crawlingProcess = cron.schedule('* * * * * *', this.onCrawlRun.bind(this));

        // first run
        this.crawlingProcess.start();
        this.crawlingInProgress = true;
    }

    private onCrawlRun(): void {
        logger.info('-----------------------------------------------');
        logger.info(`Web-Crawling - starting to collect all information at ${new Date()}`);
        logger.info('-----------------------------------------------');

        // collect all the data
        WebCrawlerService.collect().catch(err => logger.error(err));
    }
}
