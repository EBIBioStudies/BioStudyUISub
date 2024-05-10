import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared';
import { ServerError } from 'app/shared/server-error.handler';

@Component({
  selector: 'st-auth-activate',
  templateUrl: './activate.component.html'
})
export class ActivateComponent implements OnInit {
  hasError: boolean = false;
  message: string = '';

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const key = this.activatedRoute.snapshot.paramMap.get('key');

    if (key === null) {
      this.hasError = true;
      this.message = 'Invalid path';
    } else {
      this.activate(key);
    }
  }

  private activate(key: string): void {
    const component = this; // SelfSubscriber object overwrites context for "subscribe" method

    this.authService.activate(key).subscribe(
      () => {
        component.message = 'The activation was successful';
      },
      (error: ServerError) => {
        console.log(error.data.message);
        component.hasError = true;
        this.message =
          'Activation is in progress. Please try to log in after 10 minutes. Please contact us at <a href="mailto:biostudies@ebi.ac.uk?Subject=BioStudies Submission Tool error">biostudies@ebi.ac.uk</a> in case of any issues.';
      }
    );
  }
}
