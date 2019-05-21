import { Component } from '@angular/core';
import { TreeViewCustomNodeComponent } from './tree-view.component';

@Component({
    selector: 'results-log-node',
    templateUrl: './results-log-node.component.html'
})
export class ResultsLogNodeComponent implements TreeViewCustomNodeComponent {
    private _message = '';
    private _logLevel = '';

    onNodeData(data: any = {}): void {
        this._message = data.message || '';
        this._logLevel = (data.level || 'info').toLowerCase();

        // Makes parent ERRORS display as normal info nodes.
        if (data.subnodes && this._logLevel === 'error') {
            this._logLevel = 'info';
        }
    }

    get message(): string {
        return this._message;
    }

    get error(): boolean {
        return this.logLevelEquals('error');
    }

    get warn(): boolean {
        return this.logLevelEquals('warn');
    }

    get success(): boolean {
        return this.logLevelEquals('success');
    }

    get info(): boolean {
        return this.logLevelEquals('info');
    }

    private logLevelEquals(level: string): boolean {
        return this._logLevel === level;
    }
}
