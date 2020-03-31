import { FormControl } from '@angular/forms';

export function isInViewPort(rect: { bottom: number, left: number, right: number, top: number }) {
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement!.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement!.clientWidth)
  );
}

export function scrollToFormControl(control: FormControl) {
  const element: HTMLElement  = (<any>control).nativeElement;

  if (element !== undefined) {
    const rect = element.getBoundingClientRect();

    if (!isInViewPort(rect)) {
      window.scrollBy(0, rect.top - 140);
    }

    const elementRef: HTMLTextAreaElement | HTMLInputElement =
      element.querySelectorAll<HTMLTextAreaElement | HTMLInputElement>('input, textarea')[0];

    elementRef.focus();
  }
}

export function scrollTop() {
  window.scrollTo(0, 0);
}
