import { Component, OnInit, Input } from '@angular/core';
import { MessageObject } from '../../models/message-object';
import { ServicehandlerService } from '../../servicehandler.service';

@Component({
  selector: 'app-message-window',
  templateUrl: './message-window.component.html',
  styleUrls: ['./message-window.component.css']
})
export class MessageWindowComponent implements OnInit {
  @Input() messages: MessageObject[] = [];
  message: string = '';
  @Input() usernameOne: string;
  @Input() usernameTwo: string;

  numbers: number[];
  constructor(private servicehandler: ServicehandlerService) {
   }

  ngOnInit(): void {
  }

  sendMessage(){
    this.messages.push(new MessageObject(this.message,this.usernameOne));
    this.messages.push(new MessageObject("This is to test the stiff This is to test the stiff This is to test the stiff This is to test the stiff",this.usernameTwo));
    this.message = '';
  }

}
