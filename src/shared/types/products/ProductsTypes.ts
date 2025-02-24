export namespace ProductTypes {
    export interface Item {
        slug: string
        category: Category
        title: string
        description: string
        base_price: string
        main_image: string
        article: string
        produced: string
        composition: string
        collection: string
    }
    export interface ItemDetail {
        slug: string;
        title: string;
        article: string;
        composition: string
        produced: string
        category: Category;
        main_image: string;
        description: string;
        base_price: string;
        available_colors: Color[];
        available_sizes: Size[];
      }

    export interface Category {
        slug: string;
        title: string;
    }

    export interface Color {
        id: number;
        name: string;
        hex_code: string;
        images: {
          id: number;
          image: string;
        }[];
    }

    export interface Size {
        id: number;
        name: string;
    }
    export interface Variants {
        id: number
        product: Item
        color: Color
        size: Size
        price: string
        stock: number
    }
    export interface Color {
        id: number
        name: string
        hex_code: string
    }
    export interface Size {
        id: number
        name: string
    }
}
