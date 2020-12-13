import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserRegisterObject } from '../../models/user-register-object';

@Component({
  selector: 'app-register-component',
  templateUrl: './register-component.component.html',
  styleUrls: ['./register-component.component.css']
})
export class RegisterComponentComponent implements OnInit {
  isSubmitted:boolean = false;
  doesPasswordMatch:boolean = false;

  registerForm: FormGroup;

  @Output() form: EventEmitter<UserRegisterObject> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4),Validators.pattern('[a-zA-Z0-9 ]*')]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get username() { return this.registerForm.get('username').value; }
  get password() { return this.registerForm.get('password').value; }
  get confirmPassword() { return this.registerForm.get('confirmPassword').value; }
  get firstName() { return this.registerForm.get('firstName').value; }
  get lastName() { return this.registerForm.get('lastName').value; }

  onSubmit(){
    this.isSubmitted = true;
    this.doesPasswordMatch = (this.password.value == this.confirmPassword.value);

    if (this.registerForm.invalid || !this.doesPasswordMatch) {
      return;
    }
    
    this.form.emit(new UserRegisterObject(this.firstName, this.lastName,this.username,this.password));
  }

}
