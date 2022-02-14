import { Component, OnInit } from '@angular/core';
import { ServicehandlerService } from '../../servicehandler.service';
import { ActivatedRoute, Router } from '@angular/router';

import {UserObject} from '../../models/user-object';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  user: UserObject;
  imageURL: string = 'https://i.pinimg.com/564x/d9/56/9b/d9569bbed4393e2ceb1af7ba64fdf86a.jpg';
  canAdd: boolean = false;
  friends: any[] = [];

  constructor(private servicehandler: ServicehandlerService, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      this.loadUser(params['username']);
    });
   }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  loadUser(username:string) {
    this.servicehandler.getUserData(username).subscribe(data => {
      if(data != 404){
        this.user = <UserObject>data;
        this.checkRelationship();

        this.getFriendList();
      }
    });
  }

  checkRelationship(){
    this.servicehandler.checkRelationship(this.user.username).subscribe(data => {
      if(data != 404){
        if(data['usernameOne'] == this.user.username && data['status'] == 1){
          this.canAdd = true;
        }
      }else{
        this.canAdd = true;
      }
    });
  }

  getFriendList(){
    if(this.user['friends'] == undefined){
      return;
    }
    
    for(var i = 0; i < this.user['friends'].length;i++){
      this.getUserSnippet(this.user['friends'][i]['username']);
    }
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
      });
      
    });
  }

  addUser(){
    this.servicehandler.addUser(this.user['username']).subscribe();
    this.canAdd = false;
  }

  async getUserSnippet(username) {
    await this.servicehandler.getUserSnippet(username).toPromise().then(data => {
      //This returns {firstName, lastName, username, profilePictureURL}
      this.friends.push(data);
    });
  }

}
