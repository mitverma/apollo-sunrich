import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController  } from 'ionic-angular';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { AuthUser } from '../../providers/entities/entities';
import { DevicestorageProvider } from '../../providers/devicestorage/devicestorage';
import { HomePage } from '../home/home';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 const request = gql`
 mutation customerRegister($email: String!, $password: String!){
 	customerRegister(
 	input: {
 		email: $email,
 		password: $password
 	}
 	)
 	{
 		user {
 			id email token
 		}
 	}
 }`

 @IonicPage()
 @Component({
 	selector: 'page-login',
 	templateUrl: 'login.html',
 })
 export class LoginPage {
 	viewRegisterSection: any = false;
 	userRegisterDetail: any = {};
 	userLoginDetail: any = {};
 	loginMutation: any;
 	constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Apollo, public authUser: AuthUser, public deviceStorage: DevicestorageProvider, public toastCtrl: ToastController) {
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

 	login(formDetails){
 		console.log(formDetails, 'formDetais');
 		if (formDetails.valid) {
 			this.apollo.mutate({mutation:  gql` 		
 				mutation tokenCreate($email: String!, $password: String!){
 					tokenCreate(email: $email, password: $password){
 						token, errors{ message field }
 						user {
 							id email
 						}
 						checkout {
 							created id lines {
 								id variant {
 									id sku name quantity 
 								}
 							}
 						}
 					}
 				}
 				`, variables : {email: this.userLoginDetail.email, password: this.userLoginDetail.password} }).subscribe(data=>{
 					if (data.data.tokenCreate.token) {
 						this.authUser.token = data.data.tokenCreate.token;
 						this.authUser.email = data.data.tokenCreate.user.email;
 						this.authUser.userId = data.data.tokenCreate.user.id;

 						localStorage.setItem('token', this.authUser.token);

 						this.deviceStorage.setValue(this.authUser.auth_token, this.authUser);

 						Object.assign(this.authUser, this.authUser);
 						this.navCtrl.setRoot(HomePage);
 					}else {
 						// message toaster
 						let errorMessage = data.data.tokenCreate.errors[0].message;
 						console.log(errorMessage, 'toast message');
 						this.toaster(errorMessage)
 					}
 				})
 			}
 		}

 		register(formDetails){
 			if (formDetails) {
 				this.apollo.mutate({
 					mutation: gql`
 					mutation customerRegister($email: String!, $password: String!){
 						customerRegister(
 						input: {
 							email: $email,
 							password: $password
 						}
 						)
 						{
 							user {
 								id email token
 							}
 							errors { field message }
 						}
 					}` ,variables : { email: this.userRegisterDetail.email, password: this.userRegisterDetail.password }
 				}).subscribe(data=>{
 					console.log(data, 'data');
 					if (data.data.customerRegister.user) {
 						this.authUser.token = data.data.customerRegister.user.token;
 						this.authUser.email = data.data.customerRegister.user.email;
 						this.authUser.userId = data.data.customerRegister.user.id;

 						localStorage.setItem('token', this.authUser.token);
 						
 						this.deviceStorage.setValue(this.authUser.auth_token, this.authUser);

 						Object.assign(this.authUser, this.authUser);
 						this.navCtrl.setRoot(HomePage);
 					}else {
 						let errorMessage = data.data.customerRegister.errors[0].message;
 						this.toaster(errorMessage);
 					}
 				})
 			}
 		}

 		// toaster 
 		toaster(message){
 			const createToast = this.toastCtrl.create({
 				message: message,
 				duration: 3000,
 			})
 			createToast.present();
 		}
 		// toaster end


 		getOrders(){
 			this.apollo.watchQuery<any>({
 				query: gql`
 				query orders($user: String!){
 					orders(user: $user){
 						edges {
 							node {
 								id userEmail
 							}
 						}
 					}
 				}
 				`, variables : { user: "amit.verma@oneinsure.com"}
 			}).valueChanges.subscribe(data=>{
 				console.log(data, 'data');
 			})
 		}
 	}

 	// "VXNlcjo0OA=="
// "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFtaXQudmVybWFAb25laW5zdXJlLmNvbSIsImV4cCI6MTU0OTk0OTcwOSwib3JpZ19pYXQiOjE1NDk5NDk0MDl9.OrDlghSvcecehJCqgwUIynXLRsFsbYegjmI-AOd9Ppk"