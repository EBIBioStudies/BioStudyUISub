import { FormControl } from '@angular/forms';

export function scrollToFormControl(control: FormControl) {
  const element: HTMLElement  = (<any>control).nativeElement;

  if (element !== undefined) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      const elementRef: HTMLTextAreaElement | HTMLInputElement =
        element.querySelectorAll<HTMLTextAreaElement | HTMLInputElement>('input, textarea')[0];

      elementRef.focus();
    }, 200);
  }
}

export function scrollTop() {
  window.scrollTo(0, 0);
}
