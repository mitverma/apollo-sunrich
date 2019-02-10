import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { ProductDetailPage } from '../product-detail/product-detail';
/**
 * Generated class for the ProductsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



 const productQuery = gql`
 query {
 	products{
 		edges{
 			node {
 				id name description thumbnailUrl url seoDescription price {
 					localized
 				}
 				images {
 					edges {
 						node {
 							alt id url sortOrder
 						}
 					}
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
 	constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Apollo,) {
 		let variableNew = null;
 		this.apollo.watchQuery<any>({ query: productQuery, variables: variableNew }).valueChanges.subscribe(data=>{
 			if (data) {
 				this.productList =  data.data.products.edges;
 				console.log(this.productList, 'product list');
 			}
 		});
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad ProductsPage');
 	}

 	productDetail(productInfo){
 		this.navCtrl.push(ProductDetailPage, productInfo);
 	}

 }