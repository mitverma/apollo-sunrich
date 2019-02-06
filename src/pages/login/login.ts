import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
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
 	loginMutation: any;
 	constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Apollo) {
 		this.userRegisterDetail = {
 			email: '',
 			password: ''
 		}

 		this.userLoginDetail = {
 			email: '',
 			password: ''
 		}

 		// mutation for login
 		this.loginMutation = gql` 		
 		mutation {
 			tokenCreate(email: "amit.verma@oneinsure.com", password:"test1234"){
 				token, errors{message}
 				user {
 					id email
 				}
 			}
 		}
 		`;
 		// mutation for login end
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

 	login(formDetails){
 		console.log(formDetails, 'formDetais');
 		if (formDetails.valid) {
 			this.apollo.mutate({mutation:  gql` 		
 				mutation tokenCreate($email: String!, $password: String!){
 					tokenCreate(email: $email, password: $password){
 						token, errors{message}
 						user {
 							id email
 						}
 					}
 				}
 				`, variables : {email: this.userLoginDetail.email, password: this.userLoginDetail.password} }).subscribe(data=>{
 					console.log(data, 'data');
 				})
 			}
 		}

 		register(formDetails){
 			if (formDetails) {
 				this.apollo.mutate({
 					mutation: gql`
 					mutation customerRegister($input: [Object]!){
 						customerRegister(input: $input){
 							user {
 								id email token
 							}
 							errors { message }
 						}
 					}
 					`,variables : {input : { email: this.userRegisterDetail.email, password: this.userRegisterDetail.password }}
 				}).subscribe(data=>{
 					console.log(data, 'data');
 				})
 			}
 		}

 	}
