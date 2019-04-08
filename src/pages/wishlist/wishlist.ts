import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { WishListEntity } from '../../providers/entities/entities'
import { ProductDetailPage } from '../product-detail/product-detail';
import { HomePage } from '../home/home';

/**
 * Generated class for the WishlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-wishlist',
 	templateUrl: 'wishlist.html',
 })
 export class WishlistPage {

 	constructor(public navCtrl: NavController, public navParams: NavParams, 
 		public events: Events, public wishlistEntity: WishListEntity) {
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad WishlistPage');
 	}

 	removeFromlist(list){
 		let getIndex = this.wishlistEntity.wishlist.map(res=>res.id).indexOf(list.id);
 		this.wishlistEntity.wishlist.splice(getIndex, 1);

 		this.events.publish('wishlistRemoved', list);
 	}

 	viewProductDetail(productInfo){
 		let node = {
 			node: productInfo
 		};
 		this.navCtrl.push(ProductDetailPage, node);
 	}

 	openHomePage(){
 		this.navCtrl.setRoot(HomePage);
 	}

 }
