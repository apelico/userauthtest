import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageObject } from '../../models/message-object';
import { ServicehandlerService } from '../../servicehandler.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-message-window',
  templateUrl: './message-window.component.html',
  styleUrls: ['./message-window.component.css']
})
export class MessageWindowComponent implements OnInit, OnChanges {
  @Input() messages: any[];
  @Input() messengerID: string;
  @Input() receiver: string;

  message: string = '';

  constructor(private serviceHandler: ServicehandlerService, private router: Router) {
  }

  ngOnInit(): void {

  }

  ngOnChanges(){
    
  }

  sendMessage(){
    this.serviceHandler.sendMessage(this.messengerID,this.message);
    this.message = '';
  }

  subscription: Subscription;
  getMessages(){
    this.messages = [];

    this.serviceHandler.getMessages(this.messengerID).subscribe(data => {
      this.messages = <any>data['messages'];
    });

    this.subscription = this.serviceHandler.getLiveMessages(this.messengerID).subscribe(data => {
      this.messages.push(<any>data);
    });
  }

  updateMethod(){
    console.log("Testing");
  }

}
