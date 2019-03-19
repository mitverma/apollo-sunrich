import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartDetail,CheckOutEntity } from '../../providers/entities/entities';
import { CheckoutPage } from '../checkout/checkout';



/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-cart',
 	templateUrl: 'cart.html',
 })
 export class CartPage {
 	cartList: any = [];
 	subTotal: number;
 	constructor(public navCtrl: NavController, public navParams: NavParams, public cartDetail: CartDetail, public checkoutEntity : CheckOutEntity,) {
 		this.cartList = this.cartDetail.cartArray;
 		this.getCartSubTotal();
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad CartPage');
 	}
 	checkout(){
 		console.log(this.cartDetail.cartArray, 'cart array');
 		let lineMatch = true;
 		for(let i = 0; i < this.cartDetail.cartArray.length; i++){
 			let lineObj = {
 				quantity: this.cartDetail.cartArray[i].productQuantity,
 				variantId: this.cartDetail.cartArray[i].productId
 			}
 			this.checkoutEntity.checkOutList.push(lineObj);
 		}
 		this.checkoutEntity.checkoutTotal = this.subTotal;
 		console.log(this.checkoutEntity.checkOutList, 'checkoutLines');

 		Object.assign(this.checkoutEntity.checkOutList, this.checkoutEntity.checkOutList);
 		this.navCtrl.push(CheckoutPage);
 	}

 	cartQuantity(product, type){
 		if (product) {
 			this.cartDetail.cartArray.forEach((list, index)=>{
 				if (list.productId == product.productId) {
 					
 					// add functionality
 					if (type == 'add') {
 						list.productQuantity = ++list.productQuantity;
 						list.productTotalPrice = list.productPrice * list.productQuantity;
 						this.getCartSubTotal();
 					}
 					// add functionality end

 					// remove functionality
 					if (type == 'remove') {
 						if (list.productQuantity == 1) {
 							this.cartDetail.cartArray.splice(index, 1);
 						}else {
 							--list.productQuantity;
 							list.productTotalPrice = list.productPrice * list.productQuantity;
 						}

 						this.getCartSubTotal();
 					}
 					// remove functionality end
 				}
 			})
 		}
 	}

 	// get cart sub total 
 	getCartSubTotal(){
 		this.subTotal =  this.cartList.map(res=> res.productTotalPrice).reduce((prev,next)=> prev + next);
 		console.log(this.subTotal, 'subtotal');
 	}
 	// get cart sub total end

 }
