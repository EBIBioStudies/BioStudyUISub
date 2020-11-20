import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { HeaderComponent, SidebarComponent } from './components';
import { LayoutComponent, LayoutColumnComponent, LayoutHeaderComponent } from './components/layout/layout.component';

const COMPONENTS = [
  HeaderComponent,
  SidebarComponent,
  LayoutComponent,
  LayoutColumnComponent,
  LayoutHeaderComponent
];

@NgModule({
  imports: [RouterModule, SharedModule],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS]
})
export class ThemeModule {}
