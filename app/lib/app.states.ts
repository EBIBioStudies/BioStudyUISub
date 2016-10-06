import {DummyComponent} from "./nav/dummy.component.ts!ts";
import {Ng2StateDeclaration, loadNgModule} from "ui-router-ng2";

export let APP_STATES: Ng2StateDeclaration[] = [
    { name: 'signin', component: DummyComponent },
    { name: 'signup', component: DummyComponent },
    { name: 'help', component: DummyComponent },
    { name: 'submissions', component: DummyComponent },
    { name: 'files', component: DummyComponent }
];