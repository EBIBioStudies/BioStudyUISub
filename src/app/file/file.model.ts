export class UserGroup {
    constructor(readonly description: string,
                readonly name: string,
                readonly ownerId: number,
                readonly groupId: number) {
    }

    get id(): string {
        return this.groupId + ''
    };
}

export class PathInfo {
    constructor(readonly name: string,
                readonly path: string,
                readonly type: 'FILE' | 'DIR' | 'ARCHIVE',
                readonly size?: number) {
    }
}