import { Controller, Post } from '@tsed/common';
import { CronJob } from 'cron';
import * as express from 'express';
import { ITeamInfo } from '../models/types';
import { WebCrawlerService } from '../service/webCrawlerService';
import { logger } from '../utils/logger';

@Controller('/home')
export class HomeController {
    public crawlingInProgress: boolean;
    private crawlingProcess: CronJob;

    constructor() {
        this.crawlSetup();
    }

    @Post('/collect')
    public async collect(req: express.Request, res: express.Response): Promise<ITeamInfo[]> {
        return await WebCrawlerService.collect();
    }

    private crawlSetup(): void {
        this.crawlingInProgress = false;
        this.crawlingProcess = new CronJob({
            cronTime: '*/30 * * * *',
            onTick: this.onCrawlRun.bind(this),
            runOnInit: true,
        });

        // start crawling process
        this.crawlStart();
    }

    private crawlStart(): boolean {
        // prevent running multiple scap on cron
        if (this.crawlingProcess.running) {
            logger.info('Web-Crawling already in progress');
            return false;
        }

        // start scrap process
        this.crawlingInProgress = true;
        this.crawlingProcess.start();
        return true;
    }

    private onCrawlRun(): void {
        logger.info('-----------------------------------------------');
        logger.info(`Web-Crawling - starting to collect all information at ${new Date()}`);
        logger.info('-----------------------------------------------');

        // collect all the data
        WebCrawlerService.collect().catch(err => logger.error(err));

        // stop the process
        if (this.crawlingProcess) {
            this.crawlingInProgress = false;
            this.crawlingProcess.stop();
        }
    }
}
