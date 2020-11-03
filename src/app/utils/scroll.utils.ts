import { CustomFormControl } from './../pages/submission/submission-edit/shared/model/custom-form-control.model';

export function scrollToFormControl(control: CustomFormControl): void {
  const element: HTMLElement | null = document.getElementById(control.ref.id);

  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => element.focus(), 200);
  }
}

export function scrollTop(): void {
  window.scrollTo(0, 0);
}
