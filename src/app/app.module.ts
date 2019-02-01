import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login'; 

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ApolloClient } from 'apollo-client';
import { ApolloLink, concat } from 'apollo-link';
import { ApolloModule, Apollo } from 'apollo-angular';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { HttpClientModule, HttpHeaders } from "@angular/common/http";
import { HttpModule } from '@angular/http'; 



@NgModule({
  declarations: [
  MyApp,
  AboutPage,
  ContactPage,
  HomePage,
  TabsPage,
  LoginPage,
  ],
  imports: [
  BrowserModule,
  HttpModule,  
  HttpClientModule,    
  HttpLinkModule,
  IonicModule.forRoot(MyApp),
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
  ],
  providers: [
  StatusBar,
  SplashScreen,
  { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})

export class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
    ) {

    // if token is used uncmment this AND header section
    // let token = "";



    apollo.create({
      link: httpLink.create({
        uri: "http://www.sunrichrice.com/graphql/",
        withCredentials: true,
        method: 'GET'    
        // headers: new HttpHeaders({
          //   authorization: "Bearer " + token
          // })
        }),
      cache: new InMemoryCache()
    }); 
  }
}
