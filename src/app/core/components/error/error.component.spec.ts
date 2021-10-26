import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ErrorComponent } from './error.component';

Object.defineProperty(window, 'location', {
  value: {
    href: '/'
  }
});

describe('error component', () => {
  test('should render error component', async () => {
    const errorMessage = 'This is a generic error message';
    const errorCode = '500';

    await render(ErrorComponent, {
      componentProperties: {
        message: errorMessage,
        code: errorCode
      }
    });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(errorCode)).toBeInTheDocument();
    expect(screen.getByText('Submission List')).toHaveAttribute('routerlink', '/');

    userEvent.click(screen.getByText('Contact BioStudies'));

    expect(window.location.href).toEqual(
      `mailto:biostudies@ebi.ac.uk?Subject=BioStudies Submission Tool Page ${errorCode} error`
    );
  });
});
