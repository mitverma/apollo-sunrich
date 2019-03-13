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
 			mutation checkoutCreate($email: String, $firstName: String, $lastName: String,
 			$companyName: String, $streetAddress1: String, $streetAddress2: String, $city: String, $cityArea: String, 
 			$postalCode: String, $countryArea: String, $phone: String, ){
 				checkoutCreate(input: {
 					lines: [
 					{
 						variantId: "",
 						quantity: 0,
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
 						country: "",
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
 						country: "",
 						countryArea: $countryArea,
 						phone: $phone,
 					},
 					
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
 					variantId: "UHJvZHVjdFZhcmlhbnQ6MTQ"
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
 		})
 	}


 	checkoutPaymentCreate(){
 		this.apollo.mutate({
 			mutation: gql`
 			mutation checkoutPaymentCreate($checkoutId: ID!, $gateway: GatewaysEnum!, $token : String!, $amount: Decimal!, 
 			$firstName: String, $lastName: String, $companyName: String, $streetAddress1: String, $streetAddress2: String,
 			$city: String, $cityArea: String, $countryArea: String, $postalCode: String, $phone: String){
 				checkoutPaymentCreate(
 				checkoutId: $checkoutId, 
 				input: {
 					gateway: $gateway, 
 					token : $token, 
 					amount: $amount, 
 					billingAddress :  {
 						firstName: $firstName, 
 						lastName: $lastName, 
 						companyName: $companyName, 
 						streetAddress1: $streetAddress1, 
 						streetAddress2: $streetAddress2,
 						city: $city, 
 						cityArea: $cityArea, 
 						country: "", 
 						countryArea: $countryArea, 
 						postalCode: $postalCode, 
 						phone: $phone
 					}
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
 				checkoutId: "Q2hlY2tvdXQ6ODcwNTc4MGYtNmZlMi00NDQ4LThiZGUtOTVhNGUwNDk5MDlj",
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
 			console.log(data, 'data');
 		})
 	}

 	checkoutComplete(){
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
 				checkoutId : "Q2hlY2tvdXQ6ODcwNTc4MGYtNmZlMi00NDQ4LThiZGUtOTVhNGUwNDk5MDlj"
 			}
 		}).subscribe((data: any)=>{
 			console.log(data, 'data checkout completed');
 		})
 	}

 }
