import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login'; 
import { ProductDetailPage } from '../pages/product-detail/product-detail'; 
import { CartPage } from '../pages/cart/cart'; 
import { CheckoutPage } from '../pages/checkout/checkout'; 
import { OrdersPage } from '../pages/orders/orders'; 

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ApolloClient } from 'apollo-client';
import { ApolloLink, concat } from 'apollo-link';
import { ApolloModule, Apollo } from 'apollo-angular';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { HttpClientModule, HttpHeaders } from "@angular/common/http";
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { AuthUser } from '../providers/entities/entities';
import { DevicestorageProvider } from '../providers/devicestorage/devicestorage';
import { AuthProvider } from '../providers/auth/auth'; 
import { CartDetail,CheckOutEntity } from '../providers/entities/entities';


@NgModule({
  declarations: [
  MyApp,
  AboutPage,
  ContactPage,
  HomePage,
  TabsPage,
  LoginPage,
  ProductDetailPage,
  CartPage,
  CheckoutPage,
  OrdersPage
  ],
  imports: [
  BrowserModule,
  HttpModule,  
  HttpClientModule,    
  HttpLinkModule,
  IonicModule.forRoot(MyApp),
  IonicStorageModule.forRoot(),
  ApolloModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
  MyApp,
  AboutPage,
  ContactPage,
  HomePage,
  TabsPage,
  LoginPage,
  ProductDetailPage,
  CartPage,
  CheckoutPage,
  OrdersPage
  ],
  providers: [
  StatusBar,
  SplashScreen,
  { provide: ErrorHandler, useClass: IonicErrorHandler },
  AuthUser,
  DevicestorageProvider,
  AuthProvider,
  CartDetail,
  CheckOutEntity,
  ]
})

export class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
    ) {

    // if token is used uncmment this AND header section
    // let token = "";

    // if (localStorage.get) {
      //   // code...
      // }

      apollo.create({
        link: httpLink.create({
          uri: "http://www.sunrichrice.com/graphql/",
          withCredentials: true,
          // method: 'GET'    
          headers: new HttpHeaders({
            authorization: localStorage.getItem('token') !=null ? 'JWT ' + localStorage.getItem('token'): '',
          })
        }),
        cache: new InMemoryCache()
      }); 
    }
  }
