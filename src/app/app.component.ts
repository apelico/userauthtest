import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { filter } from 'rxjs/operators';

import { ServicehandlerService } from './servicehandler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'social-app';
  isLoggedIn: boolean = false;
  load: boolean = false;

  constructor(private servicehandler: ServicehandlerService, private router: Router){
    router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.checkUserAuthentication();
    });
  }

  ngOnInit(){
    this.checkUserAuthentication();
  }

  async checkUserAuthentication() {
    await this.servicehandler.getAuthenticationData().toPromise().then(data => {
      this.isLoggedIn = data != 401 ? true : false;
    });
  }
}
