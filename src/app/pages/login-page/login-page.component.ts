import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ServicehandlerService } from '../../servicehandler.service';
import { UserRegisterObject } from '../../models/user-register-object';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  isRegistering: boolean = false;
  isSubmitted:boolean = false;

  usernameInput: String;
  passwordInput: String;

  constructor(private servicehandlerService: ServicehandlerService, private router: Router) { }

  ngOnInit(): void {
  }

  clickRegister(){
    this.isRegistering = true;
  }

  registerUser(userRegisterObject: UserRegisterObject){
    this.servicehandlerService.register(userRegisterObject);
    this.isRegistering = false;
  }

  login(){
    this.servicehandlerService.login({username: this.usernameInput, password: this.passwordInput}).subscribe(data => {
      if(data != 401){
        this.servicehandlerService.setToken(data['accessToken']);
        this.router.navigate(['/home']);
      }
    });
  }

}
