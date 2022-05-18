import { TestBed } from '@angular/core/testing';
import { screen } from '@testing-library/angular';
import { UserSession } from 'app/auth/shared';
import { draftResponse } from './../../../tests/fixtures/drafts';
import { userProfile } from './../../../tests/fixtures/user-profile';
import { renderAppComponent } from '../../../tests/render';

describe('submission-edit component', () => {
  test('should render', async () => {
    const { navigate, detectChanges } = await renderAppComponent();

    // Create session to trigger User Profile flow.
    const userSession: UserSession = TestBed.inject(UserSession);
    userSession.create(userProfile);

    await navigate('new');
    // Wait for edit form to be completed
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Detects all the changes done after loading a draft submission
    detectChanges();

    // SubmNavBarComponent content
    expect(screen.getByRole('link', { name: /drafts/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: draftResponse.key })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();

    // SubmissionEditComponent header
    expect(screen.getByText('New submission')).toBeInTheDocument();
  });
});
