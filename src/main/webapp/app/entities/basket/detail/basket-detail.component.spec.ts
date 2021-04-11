import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BasketDetailComponent } from './basket-detail.component';

describe('Component Tests', () => {
  describe('Basket Management Detail Component', () => {
    let comp: BasketDetailComponent;
    let fixture: ComponentFixture<BasketDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BasketDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ basket: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(BasketDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BasketDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load basket on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.basket).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
