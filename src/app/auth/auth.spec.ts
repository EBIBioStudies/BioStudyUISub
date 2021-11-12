import { UNAUTHORIZED } from 'http-status-codes';
import { fireEvent, render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RecaptchaModule } from 'ng-recaptcha';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ThemeModule } from 'app/theme/theme.module';
import { SharedModule } from 'app/shared/shared.module';
import { AuthComponent } from './auth.component';
import { authRoutes } from './auth-routing.module';
import { AuthService } from './shared/auth.service';
import { UserSession } from './shared/user-session';
import { SignInComponent } from './signin/signin.component';
import { SignUpComponent } from './signup/signup.component';
import { rest, server } from './../../tests/server';

test('is is possible to sign in, sign up, reset password and activate account', async () => {
  const { navigate } = await render(AuthComponent, {
    imports: [SharedModule, RecaptchaModule, FormsModule, HttpClientModule, ThemeModule, ModalModule.forRoot()],
    providers: [AuthService, UserSession],
    declarations: [SignInComponent, SignUpComponent],
    routes: authRoutes
  });

  // Test signup
  await navigate('/signup');

  // const signUpSubmitButton = screen.getByRole('button', { name: /register/i });
  const signUpNameInput = screen.getByRole('textbox', { name: /name/i });
  const signUpEmailInput = screen.getByRole('textbox', { name: /email/i });
  const signUpPasswordInput = screen.getByLabelText(/password/i);
  const signUpOrcidInput = screen.getByRole('textbox', { name: /orcid/i });

  fireEvent.blur(signUpNameInput);
  fireEvent.blur(signUpEmailInput);
  fireEvent.blur(signUpPasswordInput);

  expect(signUpNameInput).toBeInvalid();
  expect(signUpEmailInput).toBeInvalid();
  expect(signUpPasswordInput).toBeInvalid();
  expect(signUpOrcidInput).toBeValid();

  // Test signin
  await navigate('/signin');

  const submitButton = screen.getByRole('button', { name: /log in/i });
  const emailInput = screen.getByRole('textbox', { name: /email/i });
  const passwordInput = screen.getByLabelText(/password/i);

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
