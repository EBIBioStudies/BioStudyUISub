import { CustomFormControl } from './../pages/submission/submission-edit/shared/model/custom-form-control.model';

export function scrollToFormControl(control: CustomFormControl): void {
  const elements: HTMLCollectionOf<Element> | null = document.getElementsByClassName(control.ref.id);

  if (elements?.length > 0) {
    const firstElement: HTMLElement = elements[0] as HTMLElement;

    firstElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => firstElement.focus(), 200);
  }
}

export function scrollTop(): void {
  window.scrollTo(0, 0);
}
