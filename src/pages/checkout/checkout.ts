import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import gql from 'graphql-tag';
import { CheckOutEntity , AuthUser, CartDetail } from '../../providers/entities/entities';
import { Apollo } from 'apollo-angular';
import { HomePage } from '../home/home';
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
 	userDetails: any = [];
 	selectedAddress: any;
 	viewAddressForm: boolean = false
 	constructor(public navCtrl: NavController,
 		public navParams: NavParams, 
 		public apollo: Apollo, 
 		public checkoutEntity: CheckOutEntity,
		 public authUser: AuthUser,
	public cartDetail: CartDetail) {

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
			 countryArea: '',
			 phone: ''
 		}

 		this.selectedAddress = {
 			id: '',
 			firstName: '',
 			lastName: '',
 			companyName: '',
 			streetAddress1: '',
 			streetAddress2: '',
 			postalCode:'',
 			city: '',
 			cityArea: '',
 			country: '',
			 countryArea: '',
			 phone: ''
 		}
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
 						console.log(this.userDetails, 'user details');
 					}
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
 							firstName: this.selectedAddress.firstName,
 							lastName: this.selectedAddress.lastName,
 							companyName: this.selectedAddress.companyName,
 							streetAddress1: this.selectedAddress.streetAddress1,
 							streetAddress2: this.selectedAddress.streetAddress2,
 							city: this.selectedAddress.city,
 							cityArea: this.selectedAddress.cityArea,
 							postalCode: this.selectedAddress.postalCode,
 							country: "IN",
 							countryArea: "Maharashtra",
 							phone: this.selectedAddress.phone,
 						},
 						billingAddress: {
 							firstName: this.selectedAddress.firstName,
 							lastName: this.selectedAddress.lastName,
 							companyName: this.selectedAddress.companyName,
 							streetAddress1: this.selectedAddress.streetAddress1,
 							streetAddress2: this.selectedAddress.streetAddress2,
 							city: this.selectedAddress.city,
 							cityArea: this.selectedAddress.cityArea,
 							postalCode: this.selectedAddress.postalCode,
 							country: "IN",
 							// countryArea: this.selectedAddress.countryArea,
 							countryArea: "Maharashtra",
 							phone: this.selectedAddress.phone,
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
 							firstName: this.selectedAddress.firstName,
 							lastName: this.selectedAddress.lastName,
 							companyName: this.selectedAddress.companyName,
 							streetAddress1: this.selectedAddress.streetAddress1,
 							streetAddress2: this.selectedAddress.streetAddress2,
 							city: this.selectedAddress.city,
 							cityArea: this.selectedAddress.cityArea,
 							postalCode: this.selectedAddress.postalCode,
 							country: "IN",
 							// countryArea: this.selectedAddress.countryArea,
 							countryArea: "Maharashtra",
 							phone: this.selectedAddress.phone,
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
						 this.viewAddressForm = false
						 this.cartDetail.cartArray = [];
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


 			viewAddForm(){
 				if (this.viewAddressForm) {
 					this.viewAddressForm = false;
 				}else {
 					this.viewAddressForm = true;
 				}
 			}

 			// select address for payment
 			selectAddress(address){
 				if (address && address.id) {
 					this.selectedAddress.id = address.id,
 					this.selectedAddress.firstName = address.firstName;
 					this.selectedAddress.lastName= address.lastName;
 					this.selectedAddress.companyName= address.companyName;
 					this.selectedAddress.streetAddress1= address.streetAddress1;
 					this.selectedAddress.streetAddress2= address.streetAddress2;
 					this.selectedAddress.city = address.city;
 					this.selectedAddress.cityArea= address.cityArea;
 					this.selectedAddress.postalCode= address.postalCode;
 					this.selectedAddress.countryArea= address.countryArea;
 					this.selectedAddress.phone= address.phone;
 					this.selectedAddress.country = address.country.code;
 				}
 				console.log(address, 'address', this.selectedAddress, 'selected address');
 			}
			 // select address for payment end
			 
			//  save address form then place order
			placeFromSaveAddress(formDetails){
				if(formDetails.valid){
					this.selectedAddress.id = this.shippingDetail.id,
 					this.selectedAddress.firstName = this.shippingDetail.firstName;
 					this.selectedAddress.lastName= this.shippingDetail.lastName;
 					this.selectedAddress.companyName= this.shippingDetail.companyName;
 					this.selectedAddress.streetAddress1= this.shippingDetail.streetAddress1;
 					this.selectedAddress.streetAddress2= this.shippingDetail.streetAddress2;
 					this.selectedAddress.city = this.shippingDetail.city;
 					this.selectedAddress.cityArea= this.shippingDetail.cityArea;
 					this.selectedAddress.postalCode= this.shippingDetail.postalCode;
 					this.selectedAddress.countryArea= this.shippingDetail.countryArea;
 					this.selectedAddress.phone= "+91"+this.shippingDetail.phone;
 					this.selectedAddress.country = this.shippingDetail.country.code;
					this.placeOrder();
				}
			}
			//  save address form then place order

			// continue shopping
			continueShopping(){
				this.navCtrl.setRoot(HomePage);
			}

 		}
