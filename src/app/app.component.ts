import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login'; 
import { HomePage } from '../pages/home/home'; 
import { CheckoutPage } from '../pages/checkout/checkout'; 
import { AuthUser } from '../providers/entities/entities';
import { DevicestorageProvider } from '../providers/devicestorage/devicestorage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = LoginPage;

  constructor(public menu: MenuController,platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authUser: AuthUser, public deviceStorage: DevicestorageProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // device storage set value and get value
      this.deviceStorage.getValue(this.authUser.auth_token).then((data)=>{
        if (data) {
          console.log(data, 'data value');
          Object.assign(this.authUser, data);
          this.nav.setRoot(HomePage);
          // this.nav.setRoot(CheckoutPage);
        }else {

        }
      })
      // device storage set value and get value end
    });
  }


  logout(){
    this.deviceStorage.removeValue(this.authUser.auth_token).then(data=>{
      Object.assign(this.authUser, new AuthUser());
      this.menu.close();
      this.nav.setRoot(LoginPage);
    })
  }
}


// query {
  //   orders(user: "VXNlcjo0OA=="){
    //     edges {
      //       node {
        //         id status
        //       }
        //     }
        //   }
        // }
