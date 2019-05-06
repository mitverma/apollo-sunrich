import { Component, ViewChild, } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, Events } from 'ionic-angular';
import { CartDetail } from '../../providers/entities/entities';
import { CartPage } from '../cart/cart';
import { DevicestorageProvider } from '../../providers/devicestorage/devicestorage';
/**
 * Generated class for the ProductDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-product-detail',
 	templateUrl: 'product-detail.html',
 })
 export class ProductDetailPage {
 	@ViewChild(Slides) slides: Slides;
 	productDetailInfo: any;
 	quantityCount: any = 0;

 	constructor(public navCtrl: NavController,
 		public navParams: NavParams,
 		public cartDetail: CartDetail,
     public events: Events,
     public deviceStorage: DevicestorageProvider) {
 		this.productDetailInfo = {
 			images: [],
 			name: '',
 			description: '',
 			price: '',
 		}

 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad ProductDetailPage');
 		if (this.navParams && this.navParams.data) {
 			this.productDetailInfo = this.navParams.data.node;
 			console.log(this.productDetailInfo, 'product detail info');
 		}


 		// set quantity count
 		if (this.cartDetail && this.cartDetail.cartArray && this.cartDetail.cartArray.length) {
 			this.cartDetail.cartArray.forEach(list=>{
 				if (list.productId == this.productDetailInfo.variants[0].id) {
 					this.quantityCount = list.productQuantity;
 				}
 			})
 		}else{
 			this.quantityCount = 0;
 		}
 		// set quantity count end
 	}

 	addToCart(product, type){
 		console.log(product, 'product');
 		let productSetObj = {
 			productId : product.variants[0] ?  product.variants[0].id : product.id,
 			productImage: product.thumbnail ? product.thumbnail.url : '',
 			productDescp: product.seoDescription,
 			productName: product.name,
 			productPrice: product.price.amount,
 			productTotalPrice: product.price.amount,
 			productQuantity: 1,
 		}
 		if (product) {
 			let productExist = true;
 			if (this.cartDetail && this.cartDetail.cartArray && this.cartDetail.cartArray.length) {
 				this.cartDetail.cartArray.forEach((list, index)=>{
 					if (list.productId == product.variants[0].id) {
 						// matches all


 						// add functionality
 						if (type == 'add') {
 							list.productQuantity = ++list.productQuantity;
 							list.productTotalPrice = list.productPrice * list.productQuantity;
               ++this.quantityCount;
              //  cart
              this.deviceStorage.updateCart(this.cartDetail.cartArray);
              //  cart end
 						}
 						// add functionality end

 						// remove functionality
 						if (type == 'remove') {
 							if (list.productQuantity == 1) {
 								this.cartDetail.cartArray.splice(index, 1);
 								--this.quantityCount;
 							}else {
 								--list.productQuantity;
 								list.productTotalPrice = list.productPrice * list.productQuantity;
 								--this.quantityCount;
               }
               //  cart
              this.deviceStorage.updateCart(this.cartDetail.cartArray);
              //  cart end
 						}
 						// remove functionality end
 						productExist = false;
 					}
 				});
 			}else{
 				if(type == 'remove') {
 					productExist = false;
 				}
 			}
 			if (productExist) {
 				this.cartDetail.cartArray.push(productSetObj);
 				this.quantityCount = 1;
				 console.log(this.cartDetail, 'cart');

 				// cart events publish
 				this.events.publish('cartDetail', this.cartDetail);
         // cart events publish end

         //  cart
         this.deviceStorage.updateCart(this.cartDetail.cartArray);
         //  cart end

 			}
 		}
 	}

 	viewCart(){
 		this.navCtrl.push(CartPage);
 	}

 	// addProductQuantity(product){
 		// 	let productSetObj = {
 			// 		productId : product.id,
 			// 		productImage: product.thumbnailUrl,
 			// 		productDescp: product.seoDescription,
 			// 		productName: product.name,
 			// 		productPrice: product.price.amount,
 			// 		productQuantity: 1,
 			// 	}
 			// 	let productExist = true;
 			// 	if (this.cartDetail && this.cartDetail.cartArray && this.cartDetail.cartArray.length) {
 				// 		this.cartDetail.cartArray.forEach((list)=>{
 					// 			if (list.productId == product.id) {
 						// 				this.quantityCount++;
 						// 				list.productQuantity = this.quantityCount;
 						// 				productExist = false;
 						// 			}
 						// 		});
 						// 	}
 						// 	if (productExist) {
 							// 		this.cartDetail.cartArray.push(productSetObj);
 							// 		this.quantityCount++;
 							// 	}
 							// }

 							// removeProductQuantity(product){
 								// 	this.cartDetail.cartArray.forEach((list, index)=>{
 									// 		if (list.productId == product.id) {
 										// 			if (list.productQuantity == 1) {
 											// 				this.cartDetail.cartArray.splice(index, 1);
 											// 				console.log(index, 'index');
 											// 			}
 											// 		}
 											// 	})
 											// }

 										}
