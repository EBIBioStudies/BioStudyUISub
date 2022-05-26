import { screen, waitFor } from '@testing-library/angular';
import { TestBed } from '@angular/core/testing';
import { UserSession } from 'app/auth/shared/user-session';
import { userProfile } from './../../../tests/fixtures/user-profile';
import { renderAppComponent } from '../../../tests/render';
import { submissionListResponse } from './../../../tests/fixtures/submissions';

jest.setTimeout(10000);

describe('submission list component', () => {
  test('should render', async () => {
    const { navigate } = await renderAppComponent();

    // Create session to trigger User Profile flow.
    const userSession: UserSession = TestBed.inject(UserSession);
    userSession.create(userProfile);

    await navigate('/');
    expect(screen.getByRole('tab', { name: /submissions/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /drafts/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New Submission' })).toBeInTheDocument();

    // Submission list column titles
    expect(screen.getByRole('columnheader', { name: 'Accession' }));
    expect(screen.getByRole('columnheader', { name: 'Title' }));

    // Submission list content
    await Promise.all(
      submissionListResponse.reduce(
        (result, submission) => [
          ...result,
          waitFor(() => expect(screen.getByText(submission.accno)).toBeInTheDocument()),
          waitFor(() => expect(screen.getByText(submission.title)).toBeInTheDocument())
        ],
        [] as Promise<void>[]
      )
    );
  });
});
