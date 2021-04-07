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
  imageURL: string = 'https://i.pinimg.com/564x/d9/56/9b/d9569bbed4393e2ceb1af7ba64fdf86a.jpg';

  constructor(private servicehandler: ServicehandlerService) { }

  ngOnInit(): void {
    this.checkUserAuthentication();
  }

  uploadPicture(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.imageURL = <string>event.target.result;
        this.servicehandler.uploadPicture(<string>event.target.result).subscribe(data => {
          
        });
      }
    }
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
