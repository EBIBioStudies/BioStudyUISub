import {Component} from '@angular/core';

@Component({
    selector: 'signin-page',
    template: `
    <div class="container-fluid">
    <div class="row-offcanvas row-offcanvas-left">
        <div class="row">
            <div class="col-md-6 col-md-offset-3">
            <signin-form></signin-form>
            </div>
        </div>
    </div>
</div>
    `
})

export class SignInPageComponent {
}