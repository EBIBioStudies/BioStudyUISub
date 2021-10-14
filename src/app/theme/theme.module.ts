import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
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
  imports: [RouterModule, SharedModule],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS]
})
export class ThemeModule {}
