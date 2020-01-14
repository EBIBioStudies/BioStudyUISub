import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HelpComponent } from './help/help.component';
import { PagesRoutingModule } from './pages-routing.module';
import { FileModule } from './file/file.module';

@NgModule({
  imports: [
    SharedModule,
    FileModule,
    PagesRoutingModule
  ],
  declarations: [HelpComponent]
})
export class PagesModule {}
