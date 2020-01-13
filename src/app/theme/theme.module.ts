import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { HeaderComponent, GlobalErrorComponent } from './components';

const COMPONENTS = [
  HeaderComponent,
  GlobalErrorComponent
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
