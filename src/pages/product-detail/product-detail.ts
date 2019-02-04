import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';

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

 	constructor(public navCtrl: NavController, public navParams: NavParams) {
 		this.productDetailInfo = {
 			images: { edges: [] },
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
 	}

 }
