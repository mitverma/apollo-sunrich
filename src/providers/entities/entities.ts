import { Injectable } from '@angular/core';

/*
  Generated class for the EntitiesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
  @Injectable()
  export class AuthUser {
  	token: string;
  	userId: string;
  	email: string;
  	auth_token: string;
  	constructor() {
  		this.token = '';
  		this.userId = '';
  		this.email = '';
  		this.auth_token = 'APP_USER';
  	}
  }