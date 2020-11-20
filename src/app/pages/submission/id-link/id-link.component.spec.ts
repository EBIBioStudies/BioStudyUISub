import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { IdLinkComponent } from './id-link.component';
import { IdLinkService } from './id-link.service';
import { Observable, of } from 'rxjs';

class IdLinkServiceMock {
  suggest(prefix: string): Observable<string[]> {
    return prefix === 'cheb' ? of(['chebi']) : of([]);
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
  });

  it('should be instantiated', () => {
    expect(component).toBeTruthy();
    expect(component.value).toBeDefined();
    expect(component.value.asString()).toBe(':');
  });
});
