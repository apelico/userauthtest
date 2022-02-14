import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ServicehandlerService } from '../../servicehandler.service';
import { PostObject } from '../../models/post-object';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  posts: PostObject[] = [];
  formGroup;
  isLoggedIn: boolean = false;

  messageList:  string[] = [];

  constructor(private servicehandler: ServicehandlerService, private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      text: ''
    });
   }

  ngOnInit(): void {
    this.servicehandler.getPosts().subscribe(data => {
      this.posts = <PostObject[]>data;
      this.posts.sort((a,b) => a.order > b.order ? -1 : a.order < b.order ? 1 : 0);
    });

    this.servicehandler.getAuthenticationData().subscribe(data => {
      if(data != 401){
        this.isLoggedIn = true;
      }
    });
  }

  createPost(postForm: any){
    this.servicehandler.createPost({text: postForm.text}).subscribe(data => {
      console.log(data);
      this.posts.unshift(<PostObject>data);
    });
    this.formGroup.reset();
  }

}
