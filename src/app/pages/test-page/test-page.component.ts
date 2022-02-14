import { Component, OnInit } from '@angular/core';
import { ServicehandlerService } from '../../servicehandler.service';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.css']
})
export class TestPageComponent implements OnInit {

  newMessage: string;
  messageList:  string[] = [];

  constructor(private serviceHandler: ServicehandlerService) {
  }

  sendMessage() {
    //this.serviceHandler.sendMessage(this.newMessage);
    this.newMessage = '';
  }
  ngOnInit() {
    /*this.serviceHandler.getMessages().subscribe((message: string) => {
        console.log(message);
        this.messageList.push(message);
    });*/
  }

}
