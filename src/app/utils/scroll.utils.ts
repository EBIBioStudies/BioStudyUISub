import { FormControl } from '@angular/forms';

export function scrollToFormControl(control: FormControl): void {
  const element: HTMLElement  = (control as any).nativeElement;

  if (element !== undefined) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      const elementRef: HTMLTextAreaElement | HTMLInputElement =
        element.querySelectorAll<HTMLTextAreaElement | HTMLInputElement>('input, textarea')[0];

      if (elementRef) {
        elementRef.focus();
      }
    }, 200);
  }
}

export function scrollTop(): void {
  window.scrollTo(0, 0);
}
