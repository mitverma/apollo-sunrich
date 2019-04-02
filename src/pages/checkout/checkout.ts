import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import gql from 'graphql-tag';
import { CheckOutEntity , AuthUser } from '../../providers/entities/entities';
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
 	addressSame: boolean = false;
 	thankyouSection: boolean = false;
 	countryList: any = [];
 	addressList: any = [];
 	constructor(public navCtrl: NavController,
 		public navParams: NavParams, 
 		public apollo: Apollo, 
 		public checkoutEntity: CheckOutEntity,
 		public authUser: AuthUser) {

 		console.log(this.authUser, 'auth user');
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

 		// dummy address list

 		this.addressList =  [
 		{
 			"id": "QWRkcmVzczoxODM=",
 			"firstName": "Amit",
 			"lastName": "Verma",
 			"companyName": "KK",
 			"streetAddress1": "407",
 			"streetAddress2": "GHS1",
 			"city": "Mumbai",
 			"cityArea": "Kurla",
 			"postalCode": "400070",
 			"country": {
 				"code": "IN",
 				"country": "India"
 			},
 			"countryArea": "Maharashtra",
 			"phone": "+918655568110"
 		},
 		{
 			"id": "QWRkcmVzczoxODQ=",
 			"firstName": "Krishna",
 			"lastName": "Yadav",
 			"companyName": "Bew Digital",
 			"streetAddress1": "Room no 407",
 			"streetAddress2": "GSC2",
 			"city": "Andheri",
 			"cityArea": "Andheri",
 			"postalCode": "400079",
 			"country": {
 				"code": "IN",
 				"country": "India"
 			},
 			"countryArea": "Maharashtra",
 			"phone": "+917021385449"
 		}
 		];
 		// dummy address list end


 		// customers(first: 100){
 			// 			edges {
 				// 				node {
 					// 					addresses {
 						// 						id firstName lastName companyName streetAddress1 streetAddress2
 						// 						city cityArea postalCode country {
 							// 							code country
 							// 						} countryArea phone 
 							// 					}
 							// 				}
 							// 			}
 							// 		}
 						}

 						ionViewDidLoad() {
 							console.log('ionViewDidLoad CheckoutPage');
 							this.getAddressList();
 							this.getCountryList();
 						}

 						setSameBilling(){
 							this.billingDetail = this.shippingDetail;
 						}

 						getCountryList(){
 							this.apollo.watchQuery<any>({query: gql`
 								query {
 									shop {
 										countries {
 											code country
 										}
 									}
 								}
 								`, variables: null}).valueChanges.subscribe((data)=>{
 									console.log(data, 'country list');
 									if (data.data) {
 										this.countryList = data.data.shop.countries;
 									}
 								})
 							}


 							getAddressList(){
 								this.apollo.watchQuery<any>({ query: gql`
 									query {
 										me {
 											addresses {
 												firstName
 											}
 										}
 									}
 									` , variables: null }).valueChanges.subscribe((data)=>{
 										console.log(data, 'data');
 									})
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
 											email: this.authUser.email,
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
 												// countryArea: this.shippingDetail.countryArea,
 												countryArea: "Maharashtra",
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
 												// countryArea: this.billingDetail.countryArea,
 												countryArea: "Maharashtra",
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
 											amount: this.checkoutEntity.checkoutTotal,
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
 												// countryArea: this.billingDetail.countryArea,
 												countryArea: "Maharashtra",
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
 										if (data.data.checkoutComplete.order.id) {
 											this.thankyouSection = true;
 										}
 									})
 								}

 								ionViewWillLeave(){
 									Object.assign(this.checkoutEntity, new CheckOutEntity());
 									console.log(this.checkoutEntity, 'checkout entity');
 								}

 								setAddress(){
 									setTimeout(()=>{
 										if (this.addressSame) {
 											this.setSameBilling();
 										}else{
 											this.billingDetail = {};
 										}
 									},500);
 								}

 							}
