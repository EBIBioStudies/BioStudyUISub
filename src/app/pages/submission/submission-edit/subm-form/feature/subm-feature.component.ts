import { ChangeDetectorRef, Component, DoCheck, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UserData } from 'app/auth/shared';
import { FeatureForm } from '../../shared/section-form';

interface FeatureOperation {
  callback: () => void;
  label: string;
}

@Component({
  selector: 'st-subm-feature',
  templateUrl: './subm-feature.component.html',
  styleUrls: ['./subm-feature.component.css']
})
export class SubmFeatureComponent implements OnInit, DoCheck {
  @ViewChild('featureEl') featureEl?: ElementRef;
  @Input() featureForm?: FeatureForm;
  @Input() isMenu?: boolean = false;
  operations: FeatureOperation[] = [];
  @Input() readonly?: boolean = false;

  private _allowedColNames: string[] = [];
  private _errorNum: number = 0;
  private _uniqueColNames: string[] = [];
  private colTypeNames: string[] = [];

  constructor(private changeRef: ChangeDetectorRef, public userData: UserData) {}

  get allowedColNames(): string[] {
    return this._allowedColNames;
  }

  get uniqueColNames(): string[] {
    return this._uniqueColNames;
  }

  get errorNum(): number {
    return this._errorNum;
  }

  /**
   * Counts the number of errors if the feature is not empty.
   */
  ngDoCheck(): void {
    this._errorNum = Object.keys(this.featureForm!.form.errors || {}).length;
    this._uniqueColNames = this.colTypeNames.filter(name => this.featureForm!.columnNames.includes(name));
    this._allowedColNames = this.featureForm!.hasUniqueColumns ? this._uniqueColNames : this.colTypeNames;
    this.changeRef.detectChanges();
  }

  ngOnInit() {
    if (this.featureForm === undefined) {
      return;
    }

    this.operations.push({
      label: 'Add column',
      callback: () => {
        this.featureForm!.addColumn();
      }
    });

    this.operations.push({
      label: 'Add row',
      callback: () => {
        this.featureForm!.addRow();
      }
    });
  }
}
