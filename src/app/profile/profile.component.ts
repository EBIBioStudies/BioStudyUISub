import { Component, OnInit } from '@angular/core';
import { UserData } from 'app/auth/shared/user-data';

@Component({
  selector: 'st-profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {
  fullname: string | null = null;
  email: string = '';
  orcid: string | null = null;
  collections: string[] = [];
  isLoading: boolean = false;

  constructor(private userData: UserData) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userData.info$.subscribe(({ fullname, email, orcid, collections }) => {
      this.fullname = fullname;
      this.email = email;
      this.orcid = orcid;
      this.collections = collections;
      this.isLoading = false;
    });
  }

  get hasCollections(): boolean {
    return this.collections.length > 0;
  }
}
