import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import gql from 'graphql-tag';
import { CheckOutEntity } from '../../providers/entities/entities';
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
 	constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Apollo, public checkoutEntity: CheckOutEntity) {
 		this.shippingDetail = {
 			firstName: '',
 			lastName: '',
 			companyName: '',
 			streetAddress1: '',
 			streetAddress2: '',
 			postalCode:'',
 			city: '',
 			cityArea: '',
 			country: '',
 			countryArea: ''
 		}

 		this.billingDetail = {
 			firstName: '',
 			lastName: '',
 			companyName: '',
 			streetAddress1: '',
 			streetAddress2: '',
 			postalCode:'',
 			city: '',
 			cityArea: '',
 			country: '',
 			countryArea: ''
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
 				lines: this.checkoutEntity.checkOutList,
 				email: "amit.verma@oneinsure.com",
 				shippingAddress: {
 					firstName: this.shippingDetail.firstName,
 					lastName: this.shippingDetail.lastName,
 					companyName: this.shippingDetail.companyName,
 					streetAddress1: this.shippingDetail.streetAddress1,
 					streetAddress2: this.shippingDetail.streetAddress2,
 					city: this.shippingDetail.city,
 					cityArea: this.shippingDetail.cityArea,
 					postalCode: this.shippingDetail.postalCode,
 					country: "IN",
 					countryArea: this.shippingDetail.countryArea,
 					phone: '+91'+this.shippingDetail.phone,
 				},
 				billingAddress: {
 					firstName: this.billingDetail.firstName,
 					lastName: this.billingDetail.lastName,
 					companyName: this.billingDetail.companyName,
 					streetAddress1: this.billingDetail.streetAddress1,
 					streetAddress2: this.billingDetail.streetAddress2,
 					city: this.billingDetail.city,
 					cityArea: this.billingDetail.cityArea,
 					postalCode: this.billingDetail.postalCode,
 					country: "IN",
 					countryArea: this.billingDetail.countryArea,
 					phone: '+91'+this.billingDetail.phone,
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
 					firstName: this.billingDetail.firstName,
 					lastName: this.billingDetail.lastName,
 					companyName: this.billingDetail.companyName,
 					streetAddress1: this.billingDetail.streetAddress1,
 					streetAddress2: this.billingDetail.streetAddress2,
 					city: this.billingDetail.city,
 					cityArea: this.billingDetail.cityArea,
 					postalCode: this.billingDetail.postalCode,
 					country: "IN",
 					countryArea: this.billingDetail.countryArea,
 					phone: '+91'+this.billingDetail.phone,
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

 	ionViewWillLeave(){
 		// Object.assign(this.checkoutEntity, new CheckOutEntity());
 		console.log(this.checkoutEntity, 'checkout entity');
 	}

 }
