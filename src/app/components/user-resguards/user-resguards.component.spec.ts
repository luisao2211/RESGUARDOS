import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserResguardsComponent } from './user-resguards.component';

describe('UserResguardsComponent', () => {
  let component: UserResguardsComponent;
  let fixture: ComponentFixture<UserResguardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserResguardsComponent]
    });
    fixture = TestBed.createComponent(UserResguardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
