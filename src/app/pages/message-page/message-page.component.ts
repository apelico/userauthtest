import { Component, OnInit } from '@angular/core';
import { last } from 'rxjs/operators';
import { MessageContainerObject } from '../../models/message-container-object';
import { MessageObject } from '../../models/message-object';

@Component({
  selector: 'app-message-page',
  templateUrl: './message-page.component.html',
  styleUrls: ['./message-page.component.css']
})
export class MessagePageComponent implements OnInit {
  activeIndex: number = 0;
  messanger: MessageContainerObject[] = [];

  constructor() {}

  ngOnInit(): void {
    this.messanger.push(new MessageContainerObject("admin"));
    this.messanger.push(new MessageContainerObject("pelico"));
    this.messanger.push(new MessageContainerObject("John"));
    this.messanger.push(new MessageContainerObject("Bill"));
    this.messanger.push(new MessageContainerObject("Mark"));
  }

  selectSnippet(index){
    this.activeIndex = <number>index;
  }

  getMessageSnippet(index): string{
    if(this.hasConversationStarted(<number>index)){
      var i = this.messanger[<number>index];

      return i.messages[i.messages.length - 1].content.substring(0,50);
    }

    return "hi";
  }

  hasConversationStarted(index: number): boolean{
    if(this.messanger[index].messages[0] !== undefined){
      return true;
    }

    return false;
  }

  getMessages(): MessageObject[]{
    return this.messanger[this.activeIndex].messages;
  }

  getUsernameOne(): string{
    return this.messanger[this.activeIndex].usernameOne;
  }

  getUsernameTwo(): string{
    return this.messanger[this.activeIndex].usernameTwo;
  }

}
