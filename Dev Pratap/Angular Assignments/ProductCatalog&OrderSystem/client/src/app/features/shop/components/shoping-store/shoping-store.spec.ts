import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopingStore } from './shoping-store';

describe('ShopingStore', () => {
  let component: ShopingStore;
  let fixture: ComponentFixture<ShopingStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopingStore],
    }).compileComponents();

    fixture = TestBed.createComponent(ShopingStore);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
