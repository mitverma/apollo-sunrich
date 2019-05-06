import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { AuthUser } from '../../providers/entities/entities';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-profile',
 	templateUrl: 'profile.html',
 })
 export class ProfilePage {
 	userDetails: any;
 	personalDetail: any = {};
 	constructor(public navCtrl: NavController, public navParams: NavParams,
 		public apollo: Apollo) {
 		this.personalDetail = {
 			firstName: '',
 			lastName: '',
 			email: '',
 		}
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad ProfilePage');
 		// this.getUserDetails();
 	}


 	getUserDetails(){
 		this.apollo.watchQuery<any>({ query: gql`
 			query {
 				me {
 					lastLogin email
 					firstName lastName
 					id addresses {
 						id firstName lastName companyName streetAddress1 streetAddress2 city cityArea postalCode country {
 							code country 
 						} countryArea phone
 					}

 				}
 			}
 			` , variables: null }).valueChanges.subscribe((data)=>{
 				if (data) {
 					this.userDetails = data.data.me;
 					this.personalDetail.firstName = this.userDetails.firstName;
 					this.personalDetail.lastName = this.userDetails.lastName;
 					this.personalDetail.email = this.userDetails.email;
 					console.log(this.personalDetail, 'personal details');
 				}
 			})
		 }
		 
		 ionViewDidEnter(){
				console.log('emter view');
				this.getUserDetails();
		 }

 	}
