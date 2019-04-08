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
    firstName: string;
    lastName: string;
    auth_token: string;
    constructor() {
      this.token = '';
      this.userId = '';
      this.email = '';
      this.firstName = '';
      this.lastName = '';
      this.auth_token = 'APP_USER';
    }
  }

  @Injectable()
  export class CartDetail {
    cartArray : any = [];
    constructor(){
      this.cartArray = [
      ];
    }
  }

  @Injectable()
  export class CheckOutEntity {
    checkOutList: any = [];
    checkoutTotal: number;
    constructor(){
      this.checkOutList = [];
      this.checkoutTotal = 0;
    }
  }

  @Injectable()
  export class WishListEntity {
    wishlist: any = [];
    constructor(){
      this.wishlist = [];
    }
  }