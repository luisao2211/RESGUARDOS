import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersreguardsComponent } from './usersreguards.component';

describe('UsersreguardsComponent', () => {
  let component: UsersreguardsComponent;
  let fixture: ComponentFixture<UsersreguardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersreguardsComponent]
    });
    fixture = TestBed.createComponent(UsersreguardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
