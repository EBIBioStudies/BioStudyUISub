import { Component } from '@angular/core';
import { TreeViewCustomNodeComponent } from './tree-view.component';

@Component({
  selector: 'st-results-log-node',
  templateUrl: './results-log-node.component.html'
})
export class ResultsLogNodeComponent implements TreeViewCustomNodeComponent {
  private resultsLogLevel = '';
  private resultsLogMessage = '';

  onNodeData(data: any = {}): void {
    this.resultsLogMessage = data.message || '';
    this.resultsLogLevel = (data.level || 'info').toLowerCase();

    // Makes parent ERRORS display as normal info nodes.
    if (data.subnodes && this.resultsLogLevel === 'error') {
      this.resultsLogLevel = 'info';
    }
  }

  get message(): string {
    return this.resultsLogMessage;
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
    return this.resultsLogLevel === level;
  }
}
