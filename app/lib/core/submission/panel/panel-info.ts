import {Attributes, Items} from '../../../submission/submission.model';

export interface PanelInfo {
    title: string;
    addNewLabel: string;
    size: number;
    addNew(): void;
}

export class AttributesInfo implements PanelInfo {
    constructor(private data: Attributes,
                public title: string,
                public addNewLabel: string) {
    }

    addNew(): void {
        this.data.addNew();
    }

    get size(): number {
        return this.data.attributes.length;
    }
}

export class ItemsInfo implements PanelInfo {
    constructor(private data: Items,
                public title: string,
                public addNewLabel: string) {
    }

    addNew(): void {
        this.data.addNew();
    }

    get size(): number {
        return this.data.items.length;
    }
}