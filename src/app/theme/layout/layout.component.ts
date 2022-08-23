import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'st-layout',
  template: `
    <div class="layout">
      <ng-content select="st-layout-header:not([subheader])"></ng-content>
      <div class="layout-container">
        <ng-content select="st-sidebar"></ng-content>
        <div class="content">
          <ng-content select="st-layout-header[subheader]"></ng-content>
          <div class="columns">
            <ng-content select="st-layout-column"></ng-content>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

@Component({
  selector: 'st-layout-header',
  template: '<ng-content></ng-content>'
})
export class LayoutHeaderComponent {}

@Component({
  selector: 'st-layout-column',
  template: '<ng-content></ng-content>'
})
export class LayoutColumnComponent {}

@Component({
  selector: 'st-layout-auth',
  template: `
    <div class="layout-auth">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./layout.component.scss']
})
export class LayoutAuthComponent {}
