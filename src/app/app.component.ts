import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { OrdersPage } from '../pages/orders/orders';
import { ProductsPage } from '../pages/products/products';
import { WishlistPage } from '../pages/wishlist/wishlist';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { CartPage } from '../pages/cart/cart';
import { AuthUser, CartDetail } from '../providers/entities/entities';
import { DevicestorageProvider } from '../providers/devicestorage/devicestorage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = LoginPage;
  menuList: any = [];

  constructor(public menu: MenuController,platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    public authUser: AuthUser,
    public deviceStorage: DevicestorageProvider,
    public cartDetail: CartDetail,) {
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
          this.menu.swipeEnable(true);
          // this.nav.
          // this.nav.setRoot(OrdersPage);
        }else {
          this.menu.swipeEnable(false);
        }
      });
      // device storage set value and get value end

      // get cart value if present
      this.deviceStorage.getCartData().then((data)=>{
        if(data){
          this.cartDetail.cartArray = data;
        }
      })
      // get cart value if present end


      // pages
      this.menuList = [
      {
        "title": "Home",
        "icon": "fa-home",
        "openPage": HomePage
      },{
        "title": "Profile",
        "icon": "fa-user",
        "openPage": ProfilePage
      },{
        "title": "Products",
        "icon": "fa-dolly",
        "openPage": ProductsPage
      },{
        "title": "Orders",
        "icon": "fa-shopping-bag",
        "openPage": OrdersPage
      },{
        "title": "Wishlist",
        "icon": "fa-heart",
        "openPage": WishlistPage
      },{
        "title": "Cart",
        "icon": "fa-shopping-cart",
        "openPage": CartPage
      }
      ];
      // pages end
    });
  }


  logout(){
    this.deviceStorage.removeValue(this.authUser.auth_token).then(data=>{
      this.menu.swipeEnable(false);
      // remove cart value
      this.deviceStorage.removeValue('cart');
      Object.assign(this.authUser, new AuthUser());
      Object.assign(this.cartDetail, new CartDetail());
      this.menu.close();
      this.nav.setRoot(LoginPage);
    });
  }

  openPage(pageInfo){
    if (pageInfo && pageInfo.title == 'Home') {
      this.nav.setRoot(pageInfo.openPage);
    }else {
      this.nav.push(pageInfo.openPage);
    }
  }

  ionViewWillEnter(){
    this.deviceStorage.getValue(this.authUser.auth_token).then((data)=>{
      if (data) {
        console.log(data, 'data value');
        Object.assign(this.authUser, data);
        this.nav.setRoot(HomePage);
      }else {
        this.nav.setRoot(LoginPage);
      }
    });
  }
}



// things to change

// 1) Checkout design floating design
// 2) Areas should be floating label and input
// 3) things which area required for checkout firstname, lastname, street Address1, city, pincodem country and state
// 4) synching of cart order from web to mobile app (will talk to Ashish bro)
// 5) Images should be changes from server and set with out background , Sliders needed for home sliders and product detail pages
// 6) Splash Screen 2732*2732 and Icon image is required 1024 * 1024
// 7) On App load Get gif images with
// 8) Profile Update mutation
// 9) Address save in profile
// 10) Shipping free or charged
// 11) Vocuher
// 12) Add to Cart Changes to  go tp cart and remove buy now
// 13) before checkout apply coupon functionalty on cart page

// things to change end
