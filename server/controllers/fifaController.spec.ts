import { ExpressApplication, InjectorService } from '@tsed/common';
import { bootstrap, inject } from '@tsed/testing';
import * as Chai from 'chai';
import * as mocha from 'mocha';
import * as Sinon from 'Sinon';
import * as SinonChai from 'sinon-chai';
import * as SuperTest from 'supertest';
import { Server } from '../server';
import { WebCrawlerService } from '../service/webCrawlerService';
import { FifaController } from './fifaController';

const expect = Chai.expect;

Chai.should();
Chai.use(SinonChai);

describe('FifaController', () => {
    let instance: any;
    let app: any;
    before(bootstrap(Server));

    before(
        inject(
            [ExpressApplication, InjectorService],
            (expressApplication: ExpressApplication, injectorService: InjectorService) => {
                instance = InjectorService.invoke(FifaController);
                app = SuperTest(expressApplication);
            },
        ),
    );

    describe('getTeams', () => {
        it('success', done => {
            const mockData = [
                {
                    code: 'KSA',
                    country: 'Saudi Arabia',
                    diffGoal: '-5',
                    draw: '0',
                    goalAgainst: '7',
                    goalFor: '2',
                    goals: '0',
                    lost: '2',
                    matchPlayed: '3',
                    penalties: '0',
                    points: '3',
                    win: '1',
                },
            ];
            const stub = Sinon.stub(WebCrawlerService, 'getTeams');
            const spy = stub.returns(Promise.resolve(mockData));

            instance
                .getTeams()
                .then(result => {
                    expect(result).to.equals(mockData);
                })
                .then(result => done())
                .catch(result => done());
            stub.restore();
        });

        it('failure', done => {
            const p = Promise.reject(new Error('error'));
            p.catch(() => done());
            const stub = Sinon.stub(WebCrawlerService, 'getTeams');
            const spy = stub.returns(p);

            instance.getTeams().catch(err => {
                expect(err.message).to.equals('error');
            });
            stub.restore();
        });

        it('route', done => {
            app.get('/rest/fifa/teams')
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

    describe('getMatches', () => {
        it('success', done => {
            const mockData = [
                {
                    awayTeam: {
                        code: 'KSA',
                        country: 'Saudi Arabia',
                        diffGoal: '-5',
                        draw: '0',
                        goalAgainst: '7',
                        goalFor: '2',
                        goals: '0',
                        lost: '2',
                        matchPlayed: '3',
                        penalties: '0',
                        points: '3',
                        win: '1',
                    },
                    dateTime: '2018-06-14T03:00:00.000Z',
                    gameStatus: 'completed',
                    homeTeam: {
                        code: 'RUS',
                        country: 'Russia',
                        diffGoal: '4',
                        draw: '0',
                        goalAgainst: '4',
                        goalFor: '8',
                        goals: '5',
                        lost: '1',
                        matchPlayed: '3',
                        penalties: '0',
                        points: '6',
                        win: '2',
                    },
                    location: 'Luzhniki Stadium',
                    stageName: 'Group A',
                    time: 'Full-time',
                    venue: 'Moscow',
                    winnerCode: 'RUS',
                },
            ];
            const stub = Sinon.stub(WebCrawlerService, 'getMatches');
            const spy = stub.returns(Promise.resolve(mockData));

            instance
                .getTeams()
                .then(result => {
                    expect(result).to.equals(mockData);
                })
                .then(result => done())
                .catch(result => done());
            stub.restore();
        });

        it('failure', done => {
            const p = Promise.reject(new Error('error'));
            p.catch(() => done());
            const stub = Sinon.stub(WebCrawlerService, 'getMatches');
            const spy = stub.returns(p);

            instance.getTeams().catch(err => {
                expect(err.message).to.equals('error');
            });
            stub.restore();
        });

        it('route', done => {
            app.get('/rest/fifa/matches')
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

    describe('getStandings', () => {
        it('success', done => {
            const mockData = [
                {
                    groupName: 'Group A',
                    teams: [
                        {
                            code: 'URU',
                            country: 'Uruguay',
                            diffGoal: '5',
                            draw: '0',
                            goalAgainst: '0',
                            goalFor: '5',
                            lost: '0',
                            matchPlayed: '3',
                            points: '9',
                            win: '3',
                        },
                        {
                            code: 'RUS',
                            country: 'Russia',
                            diffGoal: '4',
                            draw: '0',
                            goalAgainst: '4',
                            goalFor: '8',
                            lost: '1',
                            matchPlayed: '3',
                            points: '6',
                            win: '2',
                        },
                        {
                            code: 'KSA',
                            country: 'Saudi Arabia',
                            diffGoal: '-5',
                            draw: '0',
                            goalAgainst: '7',
                            goalFor: '2',
                            lost: '2',
                            matchPlayed: '3',
                            points: '3',
                            win: '1',
                        },
                        {
                            code: 'EGY',
                            country: 'Egypt',
                            diffGoal: '-4',
                            draw: '0',
                            goalAgainst: '6',
                            goalFor: '2',
                            lost: '3',
                            matchPlayed: '3',
                            points: '0',
                            win: '0',
                        },
                    ],
                },
            ];
            const stub = Sinon.stub(WebCrawlerService, 'getStandings');
            const spy = stub.returns(Promise.resolve(mockData));

            instance
                .getTeams()
                .then(result => {
                    expect(result).to.equals(mockData);
                })
                .then(result => done())
                .catch(result => done());
            stub.restore();
        });

        it('failure', done => {
            const p = Promise.reject(new Error('error'));
            p.catch(() => done());
            const stub = Sinon.stub(WebCrawlerService, 'getStandings');
            const spy = stub.returns(p);

            instance.getTeams().catch(err => {
                expect(err.message).to.equals('error');
            });
            stub.restore();
        });

        it('route', done => {
            app.get('/rest/fifa/standings')
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

    describe('getStatistics', () => {
        it('success', done => {
            const mockData = [
                {
                    goalsSavedStats: [
                        {
                            country: 'Mexico',
                            countryCode: 'MEX',
                            goalsSaveRate: '80.6%',
                            goalsSaved: '25',
                            matchesPlayed: '4',
                            minutesPlayed: '360',
                            name: 'Guillermo OCHOA',
                            playerId: '215285',
                            rank: '1',
                        },
                    ],
                },
            ];
            const stub = Sinon.stub(WebCrawlerService, 'getStatistics');
            const spy = stub.returns(Promise.resolve(mockData));

            instance
                .getTeams()
                .then(result => {
                    expect(result).to.equals(mockData);
                })
                .then(result => done())
                .catch(result => done());
            stub.restore();
        });

        it('failure', done => {
            const p = Promise.reject(new Error('error'));
            p.catch(() => done());
            const stub = Sinon.stub(WebCrawlerService, 'getStatistics');
            const spy = stub.returns(p);

            instance.getTeams().catch(err => {
                expect(err.message).to.equals('error');
            });
            stub.restore();
        });

        it('route', done => {
            app.get('/rest/fifa/standings')
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
});
