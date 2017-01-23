import {NgModule}  from '@angular/core';
import {AppConfig} from './app.config';

@NgModule({
    providers: [
        AppConfig
    ]
})
export class ConfigModule {
}