import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {
  LayoutComponent,
  LayoutColumnComponent,
  LayoutHeaderComponent,
  LayoutAuthComponent
} from './layout/layout.component';

const COMPONENTS = [
  HeaderComponent,
  SidebarComponent,
  LayoutComponent,
  LayoutColumnComponent,
  LayoutHeaderComponent,
  LayoutAuthComponent
];

@NgModule({
  imports: [CommonModule, RouterModule, SharedModule, TooltipModule],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS]
})
export class ThemeModule {}
