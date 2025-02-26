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

    export interface Product {
        slug: string;
        category: Category;
        title: string;
        description: string;
        base_price: string;
        main_image: string;
        article: string;
        produced: string;
        composition: string;
        created_at: string;
        collection: string;
        in_favorite: boolean;
        in_cart: boolean;
    }

    export interface Item {
        id: any;
        created_at: string;
        user: User;
        product: Product;
    }

    export interface ApiResponse {
        count: number;
        next: string | null;
        previous: string | null;
        results: Item[];
    }
}
