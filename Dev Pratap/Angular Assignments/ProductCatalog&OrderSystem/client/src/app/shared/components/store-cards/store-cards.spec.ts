import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreCards } from './store-cards';

describe('StoreCards', () => {
  let component: StoreCards;
  let fixture: ComponentFixture<StoreCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreCards],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
