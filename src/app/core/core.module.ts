import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { LogService } from './logger/log.service';

@NgModule({
  providers: [
    LogService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(`CoreModule has already been loaded. Import Core modules in the AppModule only.`);
    }
  }
}
