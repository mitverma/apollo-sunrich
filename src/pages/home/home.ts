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
  selectedItem: any = {};
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
    this.selectedItem = productDetail;
    if (!this.toggledToList) {
      this.wishlistEntity.wishlist.push(productDetail);
      this.toggledToList = true;
    }else {
      let getIndexToRemove = this.wishlistEntity.wishlist.map(res=> res.variants.id).indexOf(productDetail.variants.id);
      this.wishlistEntity.wishlist.splice(getIndexToRemove, 1);

      this.toggledToList = false;
    }
  }
  // add to wishlist end

  // placeOrder(){
    //   this.apollo.mutate({
      //     mutation: gql`
      //     mutation draftOrderCreate(userEmail: String!, quantity: Int!, variantId: String!){
        //       draftOrderCreate(input: {
          //         userEmail: $userEmail,
          //         lines: [
          //         {
            //           quantity: $quantity,
            //           variantId: $variantId,
            //         }
            //         ]
            //       }){
              //         errors { field message }
              //         order {
                //           id trackingClientId
                //         }
                //       }
                //     }
                //     `,variables: {
                  //       userEmail: "amit.verma@oneinsure.com",
                  //       lines: [
                  //       {
                    //         quantity: 1,
                    //         variantId:  "UHJvZHVjdDo1",
                    //       }
                    //       ]
                    //     }
                    //   }).subscribe(data=>{

                      //   })
                      // }

                      viewCart(){
                        this.navCtrl.push(CartPage);
                      }
                    }




                    // things to be done

                    // https://yalantis.com/blog/top-design-solutions-for-ecommerce-apps/
