import { Component, OnInit, Input } from '@angular/core';
import { MessageObject } from '../../models/message-object';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @Input() message: string;
  @Input() isSent: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
