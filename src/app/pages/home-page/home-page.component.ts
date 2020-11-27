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

  constructor(private servicehandler: ServicehandlerService, private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      text: ''
    });
   }

  ngOnInit(): void {
    this.posts = this.servicehandler.getPosts();
  }

  createPost(postForm: any){
    this.servicehandler.createPost({text: postForm.text});
    this.formGroup.reset();
  }

}
