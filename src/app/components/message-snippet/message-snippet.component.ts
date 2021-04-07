import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-message-snippet',
  templateUrl: './message-snippet.component.html',
  styleUrls: ['./message-snippet.component.css']
})
export class MessageSnippetComponent implements OnInit {
  @Input() username: string;
  @Input() message: string;
  
  constructor() { }

  ngOnInit(): void {
  }

}
