export class Crawler {
    private element: any;

    constructor(private readonly $: any, private readonly elem: any) {
        this.element = this.$(this.elem);
    }

    public findSelections(selector: string): any {
        return this.element.find(selector);
    }

    public findText(selector: string): string {
        return this.element
            .find(selector)
            .first()
            .text()
            .trim();
    }

    public findAttribute(selector: string, attributeName: string): string {
        return this.element
            .find(selector)
            .first()
            .attr(attributeName)
            .trim();
    }
}
