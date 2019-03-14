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
 			mutation checkoutCreate( $lines: [CheckoutLineInput]!, $email: String, $shippingAddress: AddressInput!, $billingAddress: AddressInput!){
 				checkoutCreate(input: {
 					lines: $lines,
 					email: $email,
 					shippingAddress: $shippingAddress,
 					billingAddress: $billingAddress,
 					
 				}){
 					errors { field message }
 					checkout {
 						id created
 					}
 				}
 			}
 			`,variables: {
 				lines: [
 				{
 					quantity: 2,
 					variantId: "UHJvZHVjdFZhcmlhbnQ6MTI="
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
 			console.log(data, 'data');
 			if (data) {
 				let checkoutId = data.data['checkoutCreate']['checkout']['id'];
 				console.log(checkoutId, 'checkout id');
 				this.checkoutPaymentCreate(checkoutId);
 			}
 		})
 	}


 	checkoutPaymentCreate(checkoutId){
 		this.apollo.mutate({
 			mutation: gql`
 			mutation checkoutPaymentCreate($checkoutId: ID!, $gateway: GatewaysEnum!, $token : String!, $amount: Decimal!, 
 			$billingAddress: AddressInput!){
 				checkoutPaymentCreate(
 				checkoutId: $checkoutId, 
 				input: {
 					gateway: $gateway, 
 					token : $token, 
 					amount: $amount, 
 					billingAddress : $billingAddress
 				}){
 					errors {
 						message field
 					}
 					checkout {
 						created token
 					}
 					payment {
 						gateway created
 					}
 				}
 			}
 			`, variables: {
 				checkoutId: checkoutId,
 				gateway: "COD",
 				amount: "1000",
 				token: "",
 				billingAddress: {
 					firstName :"Amit",
 					lastName: "Verma",
 					companyName:"Test",
 					streetAddress1: "Testing",
 					streetAddress2: "Testing1",
 					city: "Mumbai",
 					cityArea: "Panvel",
 					country:"IN",
 					countryArea: "Maharashtra",
 					postalCode: "400070",
 					phone: "+918655568110",
 				}
 			}
 		}).subscribe((data: any)=>{
 			this.checkoutComplete(checkoutId);
 		})
 	}

 	checkoutComplete(checkoutId){
 		this.apollo.mutate({
 			mutation: gql`
 			mutation checkoutComplete($checkoutId: ID!){
 				checkoutComplete(checkoutId: $checkoutId){
 					errors {
 						message field
 					}
 					order {
 						id
 					}
 				}
 			}
 			`, variables: {
 				checkoutId : checkoutId
 			}
 		}).subscribe((data: any)=>{
 			console.log(data, 'data checkout completed');
 		})
 	}

 }
