import { Component, OnInit } from '@angular/core';
import { MessageObject } from '../../models/message-object';

@Component({
  selector: 'app-message-snippet-window',
  templateUrl: './message-snippet-window.component.html',
  styleUrls: ['./message-snippet-window.component.css']
})
export class MessageSnippetWindowComponent implements OnInit {
  messages: MessageObject[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
