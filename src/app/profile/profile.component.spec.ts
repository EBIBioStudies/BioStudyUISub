import { ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/angular';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AuthModule } from 'app/auth/auth.module';
import { CoreModule } from 'app/core/core.module';
import { UserSession } from 'app/auth/shared';
import { ProfileComponent } from './profile.component';
import { userProfile } from './../../tests/fixtures/user-profile';
import { collections } from './../../tests/fixtures/collections';

const renderComponent = () =>
  render(ProfileComponent, {
    imports: [CommonModule, CoreModule, AuthModule, ModalModule.forRoot()],
    routes: [],
    providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }]
  });

describe('profile component', () => {
  test('should render', async () => {
    await renderComponent();

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Create session to trigger User Profile flow.
    const userSession: UserSession = TestBed.inject(UserSession);
    userSession.create(userProfile);

    await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText(userProfile.fullname)).toBeInTheDocument();

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText(userProfile.email)).toBeInTheDocument();

    expect(screen.getByText('ORCID')).toBeInTheDocument();
    expect(screen.getByText(userProfile.aux.orcid)).toBeInTheDocument();

    expect(screen.queryByText('Collections')).toBeInTheDocument();
    collections.forEach(({ accno }) => {
      expect(screen.getByText(accno)).toBeInTheDocument();
    });
  });
});
