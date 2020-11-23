import { ChangeDetectorRef, Component, DoCheck, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UserData } from 'app/auth/shared';
import { FeatureForm } from '../../shared/model/feature-form.model';

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
  @Input() featureForm!: FeatureForm;
  operations: FeatureOperation[] = [];
  @Input() readonly?: boolean = false;

  private submFeatureAllowedColNames: string[] = [];
  private submFeatureErrorNum: number = 0;
  private submFeatureUniqueColNames: string[] = [];
  private colTypeNames: string[] = [];

  constructor(private changeRef: ChangeDetectorRef, public userData: UserData) {}

  get allowedColNames(): string[] {
    return this.submFeatureAllowedColNames;
  }

  get uniqueColNames(): string[] {
    return this.submFeatureUniqueColNames;
  }

  get errorNum(): number {
    return this.submFeatureErrorNum;
  }

  /**
   * Counts the number of errors if the feature is not empty.
   */
  ngDoCheck(): void {
    this.submFeatureErrorNum = Object.keys(this.featureForm.form.errors || {}).length;
    this.submFeatureUniqueColNames = this.colTypeNames.filter((name) => this.featureForm.columnNames.includes(name));
    this.submFeatureAllowedColNames = this.featureForm.hasUniqueColumns
      ? this.submFeatureUniqueColNames
      : this.colTypeNames;
    this.changeRef.detectChanges();
  }

  ngOnInit(): void {
    if (this.featureForm === undefined) {
      return;
    }

    this.operations.push({
      label: 'Add column',
      callback: () => {
        this.featureForm.addColumn();
      }
    });

    this.operations.push({
      label: 'Add row',
      callback: () => {
        this.featureForm.addRow();
      }
    });
  }
}
