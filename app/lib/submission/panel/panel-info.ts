import {Attributes, Items} from '../submission';

// should be interface but compile doesn't like export interfaces:
// https://github.com/angular/angular-cli/issues/2034
export abstract class PanelInfo {
    abstract size: number;
    abstract addNew(): void;
}

export class AttributesInfo implements PanelInfo {
    constructor(private data: Attributes) {
    }

    addNew(): void {
        this.data.addNew();
    }

    get size(): number {
        return this.data.attributes.length;
    }
}

export class ItemsInfo implements PanelInfo {
    constructor(private data: Items) {
    }

    addNew(): void {
        this.data.addNew();
    }

    get size(): number {
        return this.data.items.length;
    }
}