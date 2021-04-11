import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BasketService } from '../service/basket.service';

import { BasketComponent } from './basket.component';

describe('Component Tests', () => {
  describe('Basket Management Component', () => {
    let comp: BasketComponent;
    let fixture: ComponentFixture<BasketComponent>;
    let service: BasketService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BasketComponent],
      })
        .overrideTemplate(BasketComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BasketComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BasketService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.baskets?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
