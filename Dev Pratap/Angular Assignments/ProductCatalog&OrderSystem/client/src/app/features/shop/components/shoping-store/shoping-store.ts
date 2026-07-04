import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-shoping-store',
  imports: [],
  templateUrl: './shoping-store.html',
  styleUrl: './shoping-store.css',
})
export class ShopingStore {
  http = inject(HttpClient)

  ngOnInit(){
    this.http.get("http://localhost:8000/product").subscribe((res)=>console.log(res))
  }
}
