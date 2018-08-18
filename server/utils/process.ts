export class Process {
    public static isTest(): boolean {
        return process.env.NODE_ENV === 'test';
    }

    public static isDev(): boolean {
        return process.env.NODE_ENV === 'dev';
    }

    public static isProduction(): boolean {
        return process.env.NODE_ENV === 'production';
    }
}
