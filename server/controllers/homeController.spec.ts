import { ExpressApplication, InjectorService } from '@tsed/common';
import { bootstrap, inject } from '@tsed/testing';
import * as Chai from 'chai';
import { CronJob } from 'cron';
import * as mocha from 'mocha';
import * as Sinon from 'Sinon';
import * as SinonChai from 'sinon-chai';
import * as SuperTest from 'supertest';
import { Server } from '../server';
import { WebCrawlerService } from '../service/webCrawlerService';
import { HomeController } from './homeController';

const expect = Chai.expect;

Chai.should();
Chai.use(SinonChai);

describe('HomeController', () => {
    let instance: any;
    let app: any;
    let crontabStub: any;
    before(bootstrap(Server));

    before(
        inject(
            [ExpressApplication, InjectorService],
            (expressApplication: ExpressApplication, injectorService: InjectorService) => {
                crontabStub = Sinon.stub(CronJob.prototype, 'start');
                instance = InjectorService.invoke(HomeController);
                app = SuperTest(expressApplication);
            },
        ),
    );

    it('initialization', () => {
        Sinon.assert.calledWith(crontabStub);
        expect(instance.crawlingInProgress).to.be.true;
    });

    it('collect', done => {
        const mockData = [
            {
                code: 'a',
                country: 'a',
            },
            {
                code: 'b',
                country: 'b',
            },
        ];
        const stub = Sinon.stub(WebCrawlerService, 'collect');
        const spy = stub.returns(Promise.resolve(mockData));

        instance
            .collect()
            .then(result => {
                expect(result).to.equals(mockData);
            })
            .then(result => done())
            .catch(err => done());
        stub.restore();
    });

    it('route', done => {
        app.post('/rest/home/collect')
            .expect(200)
            .end((err, response: any) => {
                if (err) {
                    done();
                    throw err;
                }

                const obj = JSON.parse(response.text);

                expect(obj).to.be.an('array');

                done();
            });
    });
});
