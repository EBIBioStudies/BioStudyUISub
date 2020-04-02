import { FormControl } from '@angular/forms';

export function scrollToFormControl(control: FormControl) {
  const element: HTMLElement  = (<any>control).nativeElement;

  if (element !== undefined) {
    const rect = element.getBoundingClientRect();

    window.scrollBy(0, rect.top - 140);

    const elementRef: HTMLTextAreaElement | HTMLInputElement =
      element.querySelectorAll<HTMLTextAreaElement | HTMLInputElement>('input, textarea')[0];

    elementRef.focus();
  }
}

export function scrollTop() {
  window.scrollTo(0, 0);
}
