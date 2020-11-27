import { Component, OnInit, Input } from '@angular/core';
import { PostObject } from '../../models/post-object';

@Component({
  selector: 'app-post-component',
  templateUrl: './post-component.component.html',
  styleUrls: ['./post-component.component.css']
})
export class PostComponentComponent implements OnInit {
  @Input() post: PostObject;
  

  constructor() { }

  ngOnInit(): void {
  }

  clickIcon(index: number){

  }

}
