import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
/**
 * Generated class for the OrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-orders',
 	templateUrl: 'orders.html',
 })
 export class OrdersPage {
 	ordersList: any = [];
 	constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Apollo) {
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad OrdersPage');
 		this.getOrders();
 	}

 	getOrders(){
 		this.apollo.watchQuery<any>({query: gql`
 			query {
 				orders(first: 100){
 					edges {
 						node {
 							lines {
 								id productName quantity thumbnail {
 									url alt
 								}  
 							}
 							id created status trackingClientId 
 						}
 					}
 				}
 			}
 			`, variables: null}).valueChanges.subscribe((data: any)=>{
 				console.log(data, 'order list');
 				this.ordersList = data.data.orders.edges;
 			})
 		}

 	}
