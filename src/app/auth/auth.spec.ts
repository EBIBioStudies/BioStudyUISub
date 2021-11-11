import { UNAUTHORIZED } from 'http-status-codes';
import { fireEvent, render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ThemeModule } from 'app/theme/theme.module';
import { AuthComponent } from './auth.component';
import { authRoutes } from './auth-routing.module';
import { AuthService } from './shared/auth.service';
import { UserSession } from './shared/user-session';
import { SignInComponent } from './signin/signin.component';
import { rest, server } from './../../tests/server';

test('is is possible to sign in, sign up, reset password and activate account', async () => {
  const { navigate } = await render(AuthComponent, {
    imports: [FormsModule, HttpClientModule, ThemeModule, ModalModule.forRoot()],
    providers: [AuthService, UserSession],
    declarations: [SignInComponent],
    routes: authRoutes
  });

  // Test signin
  await navigate('/signin');

  const submitButton = screen.getByRole('button', { name: /log in/i });
  const emailInput = screen.getByRole('textbox', { name: /email/i });
  const passwordInput = screen.getByLabelText(/password/i);
  // const signInErrorMessage = 'Please check the fields below and try again';

  fireEvent.blur(emailInput);
  fireEvent.blur(passwordInput);

  expect(emailInput).toBeInvalid();
  expect(passwordInput).toBeInvalid();
  expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
  expect(screen.getByText('Please enter a password')).toBeInTheDocument();

  userEvent.type(emailInput, 'pep@ebi.ac.uk');
  userEvent.type(passwordInput, '123456');

  expect(emailInput).toBeValid();
  expect(passwordInput).toBeValid();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();

  server.use(
    rest.post('/api/auth/login', (_, res, ctx) => {
      return res(ctx.status(UNAUTHORIZED), ctx.json({ log: { message: 'Invalid email address or password.' } }));
    })
  );

  userEvent.click(submitButton);
  expect(await screen.findByRole('alert')).toBeInTheDocument();
});
