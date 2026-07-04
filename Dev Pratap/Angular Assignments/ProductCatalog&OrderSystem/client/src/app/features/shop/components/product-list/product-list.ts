import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { Product, ProductListResponse } from '../../shopModel';

@Component({
  selector: 'app-product-list',
  imports: [],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  http = inject(HttpClient)

  productList = signal<Product[]>([])
  pagelist = signal<number>(0)

  ngOnInit(){
    this.http.get<ProductListResponse>("http://localhost:8000/product").subscribe(
      (res)=>{
        this.productList.set(res.data)
      }
    )
  }
}
