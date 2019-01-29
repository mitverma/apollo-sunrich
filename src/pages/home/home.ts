import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { UsersQuery, UserSummaryFragment } from '../../__generated__';
import { Observable } from 'rxjs/Observable';


const productQuery = gql`
query {
  products {
    edges {
      node {
        id name seoTitle thumbnailUrl description price {
          currency amount
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

    setTimeout(()=>{
      console.log(this.productList, 'product list');
    }, 500);
  }
}




// things to be done
