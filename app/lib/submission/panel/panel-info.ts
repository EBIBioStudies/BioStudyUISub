import {Attributes, Items} from '../../../submission/submission.model';

export interface PanelInfo {
    size: number;
    addNew(): void;
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