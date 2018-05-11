import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IdLinkComponent} from './id-link.component';
import {FormsModule} from '@angular/forms';
import {IdLinkService} from './id-link.service';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {TypeaheadModule} from "ngx-bootstrap";

class IdLinkServiceMock {
  suggest(prefix: string): Observable<string[]> {
    return prefix === 'cheb' ? Observable.of(['chebi']) : Observable.of([]);
  }
}

describe('IdLinkComponent', () => {
  let component: IdLinkComponent;
  let fixture: ComponentFixture<IdLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        IdLinkComponent,
      ],
      imports: [
        FormsModule,
        TypeaheadModule.forRoot()
      ],
      providers: [
        {provide: IdLinkService, useValue: new IdLinkServiceMock()}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.value).toBeDefined();
    expect(component.value.asString()).toBe(':');
  });
});
