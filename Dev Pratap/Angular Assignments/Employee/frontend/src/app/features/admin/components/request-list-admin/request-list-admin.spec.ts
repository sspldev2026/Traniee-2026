import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RequestListAdmin } from "./request-list-admin";

describe("RequestListAdmin", () => {
  let component: RequestListAdmin;
  let fixture: ComponentFixture<RequestListAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestListAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestListAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
