import {
    Component,
    Inject,
    Input
} from '@angular/core';

export interface TreeViewConfig {
    children(data:any):any[];
    title(data:any):string;
}

@Component({
    selector: 'tree-view-node',
    template: `
    <span><i *ngIf="hasChildren" 
             class="fa"
             [ngClass]="{'fa-minus-square-o': !isCollapsed, 'fa-plus-square-o': isCollapsed}"
             (click)="isCollapsed = !isCollapsed"
             aria-hidden="true"></i>&nbsp;{{title}}</span>
    <ul [collapse]="isCollapsed">
        <li  *ngFor="let child of children">
            <tree-view-node [data]="child"
                            [config]="config"></tree-view-node>
        </li>
    </ul>
`,
    styles: [`
li {
    list-style-type:none;
    margin:0;
    padding:10px 5px 0 5px;
    position:relative
}
li::before, li::after {
    content:'';
    left:-20px;
    position:absolute;
    right:auto
}
li::before {
    border-left:1px solid #999;
    bottom:50px;
    height:100%;
    top:0;
    width:1px
}
li::after {
    border-top:1px solid #999;
    height:20px;
    top:25px;
    width:25px
}
:host span {
    -moz-border-radius:5px;
    -webkit-border-radius:5px;
    border:1px solid #999;
    border-radius:5px;
    display:inline-block;
    padding:3px 8px;
    text-decoration:none
}

li:last-child::before {
    height:30px
}
`]
})
export class TreeViewNodeComponent {
    @Input() data: any;
    @Input() config: TreeViewConfig;

    private isCollapsed:boolean = false;

    get children(): any [] {
        return this.config.children(this.data);
    }

    get title(): string {
        return this.config.title(this.data);
    }

    get hasChildren():boolean {
        return this.children.length > 0;
    }
}


@Component({
    selector: 'tree-view',
    template: `
<div class="tree">
     <tree-view-node [data]="data" 
                     [config]="config"></tree-view-node>                   
</div>        

`,
    styles:[`
.tree {
    min-height:20px;
    padding:19px;
    margin-bottom:20px;
    background-color:#fbfbfb;
    border:1px solid #999;
    -webkit-border-radius:4px;
    -moz-border-radius:4px;
    border-radius:4px;
    -webkit-box-shadow:inset 0 1px 1px rgba(0, 0, 0, 0.05);
    -moz-box-shadow:inset 0 1px 1px rgba(0, 0, 0, 0.05);
    box-shadow:inset 0 1px 1px rgba(0, 0, 0, 0.05)
}
`]
})
export class TreeViewComponent {
    @Input() data: any;
    @Input() config: TreeViewConfig;
}