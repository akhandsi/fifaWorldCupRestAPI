import { readFileSync, writeFileSync } from 'fs';
import { IModel } from '../models/types';

export abstract class Processor<M extends IModel> {
    constructor(private readonly filePath: string) {}

    public abstract async collect(): Promise<M[]>;

    public createModel($: any, elem: any): M {
        throw new Error('not implemented');
    }

    public read(): M[] {
        return JSON.parse(readFileSync(this.filePath).toString());
    }

    public save(dataSet: M[]): void {
        writeFileSync(this.filePath, JSON.stringify(dataSet, null, 4));
    }
}
