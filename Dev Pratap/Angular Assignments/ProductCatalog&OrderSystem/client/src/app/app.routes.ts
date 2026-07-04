import { Routes } from '@angular/router';
import { ShopingStore } from './features/shop/components/shoping-store/shoping-store';
import { AddProduct } from './features/shop/components/add-product/add-product';
import { ProductList } from './features/shop/components/product-list/product-list';

export const routes: Routes = [
    {
        path:"",
        component:ShopingStore
    },
    {
        path:"product",
        component:ProductList
    }
];
