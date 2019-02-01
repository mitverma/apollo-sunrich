import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-login',
 	templateUrl: 'login.html',
 })
 export class LoginPage {
 	viewRegisterSection: any;
 	userRegisterDetail: any = {};
 	userLoginDetail: any = {};
 	constructor(public navCtrl: NavController, public navParams: NavParams) {
 		this.userRegisterDetail = {
 			email: '',
 			password: ''
 		}

 		this.userLoginDetail = {
 			email: '',
 			password: ''
 		}
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad LoginPage');
 	}

 	toggleView(viewType){
 		if (viewType == 'registerView') {
 			this.viewRegisterSection = true;
 		}else if(viewType == 'loginView'){
 			this.viewRegisterSection = false;
 		}
 	}

 }
