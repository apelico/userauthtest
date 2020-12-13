import { Component, OnInit } from '@angular/core';
import { ServicehandlerService } from '../../servicehandler.service';

import {UserObject} from '../../models/user-object';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  user: UserObject;

  constructor(private servicehandler: ServicehandlerService) { }

  ngOnInit(): void {
    this.checkUserAuthentication();
  }

  async checkUserAuthentication() {
    await this.servicehandler.getAuthenticationData().toPromise().then(data => {

      this.servicehandler.getUserData(data['username']).subscribe(data => {
        this.user = <UserObject>data;
        console.log(data);
      });
      
    });
  }

}
