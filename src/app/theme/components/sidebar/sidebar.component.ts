import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'st-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  collapsed: boolean = false;
  @Output() toggle = new EventEmitter();

  /**
   * Handler for the button toggling the collapsed state of the whole sidebar menu,
   * bubbling the menu's state up.
   * @param [event] - Optional click event object.
   */
  onToggleCollapse(event?: Event): void {
    // tslint:disable-next-line: no-unused-expression
    event && event.preventDefault();

    this.collapsed = !this.collapsed;

    if (this.toggle) {
      this.toggle.emit();
    }
  }
}
