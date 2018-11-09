import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {ServerError} from '../../../http/server-error.handler';
import {SectionForm} from '../section-form';
import {Option} from 'fp-ts/lib/Option';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {SubmEditService} from '../subm-edit.service';
import {throttleTime} from 'rxjs/operators';
import {MyFormControl} from '../form-validators';

type FormControlGroup = Array<FormControl>;

@Component({
    selector: 'subm-sidebar',
    templateUrl: './subm-sidebar.component.html',
    styleUrls: ['./subm-sidebar.component.css']
})
export class SubmSidebarComponent implements OnDestroy {
    @Input() collapsed?: boolean = false;
    @Input() sectionForm?: SectionForm;
    @Output() toggle? = new EventEmitter();

    serverError?: ServerError;
    invalidControls: FormControlGroup[] = [];

    isCheckTabActive: boolean = true;

    private controls: Array<FormControl>[] = [];
    private unsubscribe = new Subject<void>();
    private unsubscribeForm = new Subject<void>();

    constructor(private submEditService: SubmEditService) {
        this.submEditService.serverError$.takeUntil(this.unsubscribe)
            .subscribe(error => {
                this.serverError = ServerError.fromResponse(error);
            });

        this.submEditService.sectionSwitch$.takeUntil(this.unsubscribe)
            .subscribe(sectionForm => this.switchSection(sectionForm));
    }

    ngOnDestroy(): void {
        this.unsubscribeForm.next();
        this.unsubscribeForm.complete();

        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    get isEditTabActive(): boolean {
        return !this.isCheckTabActive;
    }

    onCheckTabClick(): void {
        this.isCheckTabActive = true;
    }

    onAddTabClick(): void {
        this.isCheckTabActive = false;
    }

    get numInvalid(): number {
        return this.invalidControls.flatMap(c => c).length;
    }

    get numInvalidAndTouched(): number {
        return this.invalidControls.flatMap(c => c).filter(c => c.touched).length;
    }

    /**
     * Handler for the button toggling the collapsed state of the whole sidebar menu,
     * bubbling the menu's state up.
     * @param {Event} [event] - Optional click event object.
     */
    onToggleCollapse(event?: Event): void {
        event && event.preventDefault();
        this.toggle && this.toggle.emit();
    }

    private switchSection(sectionFormOp: Option<SectionForm>) {
        this.unsubscribeForm.next();

        if (sectionFormOp.isSome()) {
            const secForm = sectionFormOp.toUndefined()!;
            secForm.structureChanges$.takeUntil(this.unsubscribeForm).subscribe(
                () => {
                    this.controls = this.groupControlsBySectionId(secForm.controls());
                    this.updateInvalidControls();
                }
            );
            secForm.form.statusChanges.takeUntil(this.unsubscribeForm).subscribe(() => {
                this.updateInvalidControls();
            });
        }
    }

    private updateInvalidControls() {
        this.invalidControls = this.controls.map(g => g.filter(c => c.invalid)).filter(g => !g.isEmpty());
    }

    private groupControlsBySectionId(controls: FormControl[]): FormControlGroup[] {
        return controls
            .reduce((rv, c) => {
                const group = rv.isEmpty() ? undefined : rv[rv.length - 1];
                const prevControl = group === undefined ? undefined : group[group.length - 1];
                if (prevControl !== undefined && MyFormControl.compareBySectionId(prevControl, c) === 0) {
                    group!.push(c);
                } else {
                    rv.push([c]);
                }
                return rv;
            }, [] as Array<FormControlGroup>);
    }
}