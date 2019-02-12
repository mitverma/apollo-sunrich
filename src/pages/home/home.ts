import { Component,ViewChild} from '@angular/core';
import { NavController,Slides} from 'ionic-angular';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { UsersQuery, UserSummaryFragment } from '../../__generated__';
import { Observable } from 'rxjs/Observable';
import { ProductDetailPage } from '../product-detail/product-detail';


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

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;
  users$: Observable<UserSummaryFragment[]>;
  productList: any = [];

  constructor(
    public navCtrl: NavController,
    private apollo: Apollo,
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
      `, variables : { user: "amit.verma@oneinsure.com"}
    }).valueChanges.subscribe(data=>{
      console.log(data, 'data');
    })
  }
}




// things to be done
