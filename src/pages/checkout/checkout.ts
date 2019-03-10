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
 			mutation checkoutCreate($quantity: Int!, $variantId: String!, $email: String!, $firstName: String!, $lastName: String!,
 			$companyName: String!, $streetAddress1: String!, $streetAddress: String!, $city: String!, $cityArea: String!, 
 			$postalCode: String!, $country: String!, $countryArea: String!, $phone: String!){
 				checkoutCreate(input: {
 					lines: [
 					{
 						quantity: $quantity,
 						variantId: $variantId,
 					}
 					],
 					email: $email,
 					shippingAddress: {
 						firstName: $firstName,
 						lastName: $lastName,
 						companyName: $companyName,
 						streetAddress1: $streetAddress1,
 						streetAddress2: $streetAddress2,
 						city: $city,
 						cityArea: $cityArea,
 						postalCode: $postalCode,
 						country: $country,
 						countryArea: $countryArea,
 						phone: $phone,
 					},
 					billingAddress: {
 						firstName: $firstName,
 						lastName: $lastName,
 						companyName: $companyName,
 						streetAddress1: $streetAddress1,
 						streetAddress2: $streetAddress2,
 						city: $city,
 						cityArea: $cityArea,
 						postalCode: $postalCode,
 						country: $country,
 						countryArea: $countryArea,
 						phone: $phone,
 					},
 					
 				}){
 					errors { field message }
 					order {
 						id trackingClientId
 					}
 				}
 			}
 			`,variables: {
 				lines: [
 				{
 					quantity: 1,
 					variantId: "UHJvZHVjdFZhcmlhbnQ6MTQ",
 				},
 				],
 				email: "amit.verma@oneinsure.com",
 				shippingAddress: {
 					firstName: "Test",
 					lastName: "User",
 					companyName: "Test Company",
 					streetAddress1: "Test123",
 					streetAddress2: "Test1234",
 					city: "Mumbai",
 					cityArea: "Andheri",
 					postalCode: "400072",
 					country: "IN",
 					countryArea: "Maharashtra",
 					phone: "+919988776655",
 				},
 				billingAddress: {
 					firstName: "Test",
 					lastName: "User",
 					companyName: "Test Company",
 					streetAddress1: "Test123",
 					streetAddress2: "Test1234",
 					city: "Mumbai",
 					cityArea: "Andheri",
 					postalCode: "400072",
 					country: "IN",
 					countryArea: "Maharashtra",
 					phone: "+919988776655",
 				}
 			}
 		}).subscribe(data=>{

 		})
 	}

 }
