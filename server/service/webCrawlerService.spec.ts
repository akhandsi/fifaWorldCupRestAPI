import { InjectorService } from '@tsed/common';
import { bootstrap, inject } from '@tsed/testing';
import * as Chai from 'chai';
import * as mocha from 'mocha';
import * as Sinon from 'Sinon';
import * as SinonChai from 'sinon-chai';
import { Server } from '../server';
import { MatchProcessor } from './matchProcessor';
import { StandingProcessor } from './standingProcessor';
import { StatisticsProcessor } from './statisticsProcessor';
import { TeamProcessor } from './teamProcessor';
import { WebCrawlerService } from './webCrawlerService';

const expect = Chai.expect;

Chai.should();
Chai.use(SinonChai);

describe('WebCrawlerService', () => {
    let instance: any;
    before(bootstrap(Server));

    before(
        inject([InjectorService], (injectorService: InjectorService) => {
            instance = InjectorService.invoke(WebCrawlerService);
        }),
    );

    it('getTeams', () => {
        const stub = Sinon.stub(TeamProcessor.prototype, 'read').returns([
            {
                code: 'a',
            },
        ]);
        stub.restore();
    });

    it('getMatches', () => {
        const stub = Sinon.stub(MatchProcessor.prototype, 'read');
        stub.restore();
    });

    it('getStandings', () => {
        const stub = Sinon.stub(StandingProcessor.prototype, 'read');
        stub.restore();
    });

    it('getStatistics', () => {
        const stub = Sinon.stub(StatisticsProcessor.prototype, 'read');
        stub.restore();
    });
});
