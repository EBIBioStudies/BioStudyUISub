import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { HeaderComponent, ErrorToastComponent, SidebarComponent } from './components';

const COMPONENTS = [
  HeaderComponent,
  ErrorToastComponent,
  SidebarComponent
];

@NgModule({
  imports: [
    RouterModule,
    SharedModule
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS]
})
export class ThemeModule {}
