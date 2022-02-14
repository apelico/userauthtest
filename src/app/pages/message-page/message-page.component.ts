import { Component, OnChanges, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageContainerObject } from '../../models/message-container-object';
import { MessageObject } from '../../models/message-object';

import { ServicehandlerService } from '../../servicehandler.service';

@Component({
  selector: 'app-message-page',
  templateUrl: './message-page.component.html',
  styleUrls: ['./message-page.component.css']
})
export class MessagePageComponent implements OnInit, OnChanges {
  friends: any[];
  activeIndex: number = 0;
  messages: any[];

  subscription: Subscription;

  constructor(private serviceHandler: ServicehandlerService) {}

  ngOnInit(): void {
    this.getFriends();
  }

  ngOnChanges(){
  }

  selectSnippet(index){
    this.activeIndex = <number>index;
    if(this.subscription != undefined){
      this.subscription.unsubscribe();
    }
    this.getMessages();

  }

  getMessengerID(){
    if(this.friends == undefined){
      return;
    }

    return this.friends[this.activeIndex]['messengerID'];
  }

  getUsername(): string{
    if(this.friends == undefined){
      return;
    }

    return this.friends[this.activeIndex]['username'];
  }

  getFriends(){
    this.serviceHandler.getFriends().subscribe(data => {
      this.friends = data['friends'];
    });
  }

  getMessages(){
    this.messages = [];
    this.serviceHandler.getMessages(this.getMessengerID()).subscribe(data => {
      this.messages = <any>data['messages'];
    });



    this.subscription = this.serviceHandler.getLiveMessages(this.getMessengerID()).subscribe(data => {
      this.messages.push(<any>data);
    });
  }

}
