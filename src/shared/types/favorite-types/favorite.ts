import { ProductTypes } from '../products/ProductsTypes'

export namespace FavoritesType {
    export interface Form {
        product: string | string[] | undefined
    }

    export interface User {
        id: number;
        email: string;
    }

    export interface Category {
        slug: string;
        title: string;
    }
    export interface Item {
        id: any;
        created_at: string;
        user: User;
        product: ProductTypes.Item;
    }

    export interface ApiResponse {
        count: number;
        next: string | null;
        previous: string | null;
        results: Item[];
    }
}
