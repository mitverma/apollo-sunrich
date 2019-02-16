import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-checkout',
 	templateUrl: 'checkout.html',
 })
 export class CheckoutPage {
 	shippingDetail: any;
 	billingDetail: any;
 	constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Apollo) {
 		this.shippingDetail = {
 			firstName: '',
 			lastName: '',
 			streetAddress: '',
 			postalCode:'',
 			city: '',
 			country: ''
 		}

 		this.billingDetail = {
 			firstName: '',
 			lastName: '',
 			streetAddress: '',
 			postalCode:'',
 			city: '',
 			country: ''
 		}
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad CheckoutPage');
 	}

 	setSameBilling(){
 		this.billingDetail = this.shippingDetail;
 	}

 	placeOrder(){
 		this.apollo.mutate({
 			mutation: gql`
 			mutation draftOrderCreate(userEmail: String!, quantity: Int!, variantId: String!, user: String!, firstName: $String,
 			lastName: String!, streetAddress1: String!, postalCode: String, phone: $phone, city: String!, country: String!,
 			quantity: Int!, variantId: String!){
 				draftOrderCreate(input: {
 					userEmail: $userEmail,
 					user: $user,
 					shippingAddress: {
 						firstName: $firstName,
 						lastName: $lastName,
 						streetAddress1: $streetAddress1,
 						postalCode: $postalCode,
 						phone: $phone,
 						city: $city,
 						country: $country,
 					}
 					lines: [
 					{
 						quantity: $quantity,
 						variantId: $variantId,
 					}
 					]
 				}){
 					errors { field message }
 					order {
 						id trackingClientId
 					}
 				}
 			}
 			`,variables: {
 				userEmail: "amit.verma@oneinsure.com",
 				user: "",
 				shippingAddress: {
 					firstName: "Amit",
 					lastName: "Verma",
 					streetAddress1: "Tilak Nagar",
 					postalCode: "400070",
 					phone: "8655568110",
 					city: "Mumbai",
 					country: "Maharashtra"
 				},
 				lines: [
 				{
 					quantity: 1,
 					variantId:  "UHJvZHVjdDo1",
 				}
 				]
 			}
 		}).subscribe(data=>{

 		})
 	}

 }
