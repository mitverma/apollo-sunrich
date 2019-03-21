import { Component,ViewChild} from '@angular/core';
import { NavController,Slides, Events } from 'ionic-angular';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { UsersQuery, UserSummaryFragment } from '../../__generated__';
import { Observable } from 'rxjs/Observable';
import { ProductDetailPage } from '../product-detail/product-detail';
import { CartPage } from '../cart/cart';
import { CartDetail, WishListEntity } from '../../providers/entities/entities';


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

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;
  users$: Observable<UserSummaryFragment[]>;
  productList: any = [];
  toggledToList: boolean = false;
  selectedItemId: any = -1;
  constructor(
    public navCtrl: NavController,
    private apollo: Apollo,
    public cartDetail: CartDetail,
    public events: Events,
    public wishlistEntity: WishListEntity,
    ) {
    // this.users$ = this.apollo.query<UsersQuery>({ query })
    // .map(({ data }) => data.allUsers);
    let variableNew = null;
    this.apollo.watchQuery<any>({ query: productQuery, variables: variableNew }).valueChanges.subscribe(data=>{
      if (data) {
        this.productList =  data.data.products.edges;
        console.log(this.productList, 'product list');
      }
    });
  }

  ionViewDidLoad(){
    this.events.subscribe('cartDetail', (data)=>{
      if (data) {
        this.cartDetail = data;
      }
    });

    this.events.subscribe('wishlistRemoved', (data)=>{
      if (data) {
        this.productList.forEach(list=>{
          if (list.node.id == data.id) {
            list.node.itemWishlisted = false;
          }
        })
      }
    })
  }


  previousSlide(){
    this.slides.slidePrev();
  }
  nextSlide(){
    this.slides.slideNext();
  }

  productDetail(productInfo){
    this.navCtrl.push(ProductDetailPage, productInfo);
  }

  getOrders(){
    this.apollo.watchQuery<any>({
      query: gql`
      query orders($user: String!){
        orders(user: $user){
          edges {
            node {
              id userEmail
            }
          }
        }
      }
      `, variables : { user: "amit.verma@oneinsure.com" }
    }).valueChanges.subscribe(data=>{
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

  viewCart(){
    this.navCtrl.push(CartPage);
  }
}




// things to be done

// https://yalantis.com/blog/top-design-solutions-for-ecommerce-apps/
