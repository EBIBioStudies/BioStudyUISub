import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from 'app/core/core.module';
import { ProfileComponent } from './profile.component';

@NgModule({
  imports: [CommonModule, CoreModule],
  declarations: [ProfileComponent]
})
export class ProfileModule {}
