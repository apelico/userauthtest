import { Component, OnInit, Input } from '@angular/core';
import { PostObject } from '../../models/post-object';
import { UserObject } from '../../models/user-object';
import { ServicehandlerService } from '../../servicehandler.service';

@Component({
  selector: 'app-post-component',
  templateUrl: './post-component.component.html',
  styleUrls: ['./post-component.component.css']
})
export class PostComponentComponent implements OnInit {
  @Input() post: PostObject;
  user: UserObject;
  

  constructor(private servicehandler: ServicehandlerService) { }

  ngOnInit(): void {
    this.servicehandler.getUserData(this.post.username).subscribe(data => {
      this.user = <UserObject>data;
    });
  }

  clickIcon(index: number){

  }

}
