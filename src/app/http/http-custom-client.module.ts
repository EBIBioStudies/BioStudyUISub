import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [
        HttpClientModule
    ],
    exports: [
        HttpClientModule
    ],
    providers: []
})
export class HttpCustomClientModule {
}
