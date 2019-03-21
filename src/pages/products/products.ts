import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { ProductDetailPage } from '../product-detail/product-detail';
import { AuthUser,WishListEntity } from '../../providers/entities/entities';


/**
 * Generated class for the ProductsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



 const productQuery = gql`
 query {
 	products(first: 100){
 		edges {
 			node {
 				id name description seoDescription images {
 					id alt url
 				}
 				price {
 					currency amount localized
 				}
 				variants {
 					id sku name quantity quantityAllocated 
 				}
 				thumbnail {
 					url alt
 				}
 			}
 		}
 	}
 }
 `;

 @IonicPage()
 @Component({
 	selector: 'page-products',
 	templateUrl: 'products.html',
 })
 export class ProductsPage {
 	productList: any = [];
 	constructor(public navCtrl: NavController, 
 		public navParams: NavParams, 
 		public apollo: Apollo,
 		public authUser: AuthUser,
 		public wishlistEntity: WishListEntity) {
 		let variableNew = null;
 		this.apollo.watchQuery<any>({ query: productQuery, variables: variableNew }).valueChanges.subscribe(data=>{
 			if (data) {
 				this.productList =  data.data.products.edges;

 				this.productList.forEach(list=>{
 					list.node.itemWishlisted = false;
 				});

 				console.log(this.productList, 'product list');

 				if (this.wishlistEntity.wishlist.length) {
 					this.productList.forEach(list=>{
 						this.wishlistEntity.wishlist.forEach(wishList=>{
 							if (list.node.id == wishList.id) {
 								list.node.itemWishlisted = true;
 							}
 						})
 					})
 				}
 			}
 		});
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad ProductsPage');
 	}

 	productDetail(productInfo){
 		this.navCtrl.push(ProductDetailPage, productInfo);
 	}


 	getOrdersList(){
 		this.apollo.mutate({mutation: gql``,
 			variables: {user: this.authUser.userId}
 		}).subscribe((data)=>{
 			console.log(data, 'data');
 		})
 	}

 	// add to wishlist
 	addToWishlist(productDetail){
 		let addToWishlist = true;
 		if (this.wishlistEntity.wishlist.length) {
 			this.wishlistEntity.wishlist.forEach((list, index)=>{
 				if (list.id == productDetail.id) {
 					this.wishlistEntity.wishlist.splice(index, 1);
 					addToWishlist = false;
 					this.productList.forEach((list, index)=>{
 						if (list.node.id == productDetail.id) {
 							list.node.itemWishlisted = false;
 						}
 					});
 				}
 			});        
 		}
 		if (addToWishlist) {
 			this.wishlistEntity.wishlist.push(productDetail);
 			this.productList.forEach((list, index)=>{
 				if (list.node.id == productDetail.id) {
 					list.node.itemWishlisted = true;
 				}
 			});
 		}
 		console.log(this.wishlistEntity.wishlist, 'wishlist', this.productList, 'product list');
 	}
 	// add to wishlist end
 }
