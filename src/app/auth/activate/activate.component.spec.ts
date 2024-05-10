import { HttpClientModule } from '@angular/common/http';
import { render, screen } from '@testing-library/angular';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { BAD_REQUEST } from 'http-status-codes';
import { ThemeModule } from 'app/theme/theme.module';
import { rest, server } from './../../../tests/server';
import { ActivateComponent } from './activate.component';
import { AuthService } from '../shared/auth.service';
import { UserSession } from '../shared/user-session';

const renderComponent = (paramMap) =>
  render(ActivateComponent, {
    imports: [HttpClientModule, ThemeModule, ModalModule.forRoot()],
    providers: [AuthService, UserSession, { provide: ActivatedRoute, useValue: { snapshot: { paramMap } } }],
    routes: []
  });

describe('activate component', () => {
  const activationKey = '1213454321234';
  const paramMap = new Map().set('key', activationKey);

  test('should render invalid path if the key is provided in the URL', async () => {
    await renderComponent(new Map().set('key', null));

    expect(screen.getByText('Invalid path')).toBeInTheDocument();
    expect(screen.getByText('Back to Log in')).toHaveAttribute('href', '/signin');
  });

  test('should activate', async () => {
    await renderComponent(paramMap);

    expect(screen.getByText('Activating')).toBeInTheDocument();
    expect(await screen.findByText('The activation was successful')).toBeInTheDocument();
  });

  test('should render error message if there are errors activating the account', async () => {
    const errorMessage = 'Key is not valid';
    server.use(
      rest.post(`/api/auth/activate/:key`, (_, res, ctx) => {
        return res(ctx.status(BAD_REQUEST), ctx.json({ log: { message: errorMessage } }));
      })
    );

    await renderComponent(paramMap);

    expect(screen.getByText('Activating')).toBeInTheDocument();
    expect(await screen.findByTitle(errorMessage)).toBeInTheDocument();
  });
});
