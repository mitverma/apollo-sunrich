import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartDetail } from '../../providers/entities/entities';
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
 	constructor(public navCtrl: NavController, public navParams: NavParams, public cartDetail: CartDetail) {
 		this.cartList = this.cartDetail.cartArray;
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad CartPage');
 	}
 	checkout(){
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
 					}
 					// remove functionality end
 				}
 			})
 		}
 	}

 }
