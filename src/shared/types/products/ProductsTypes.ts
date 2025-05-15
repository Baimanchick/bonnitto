export namespace ProductTypes {
    export interface Item {
        slug: string
        category: Category
        title: string
        description: string
        discount: string
        base_price: string
        main_image: string
        article: string
        produced: string
        composition: string
        collection: string
        available_colors: Color[]
    }

    export interface DefaultItemDetail {
        slug: string
        title: string
        article: string
        composition: string
        produced: string
        size_charts: SizeChart[]
        related_products: RelatedProducts[]
        discount: any
        category: Category
        main_image: string
        description: string
        base_price: string
        in_cart: boolean
        in_favorite: boolean
        available_colors: Color[]
        available_sizes: Size[]
    }

    interface RelatedProducts {
        slug: string;
        title: string;
        main_image: string;
        type: string;
    }
    export interface ItemDetail {
        color: Color
        size: Size
        id: number
        price: any
        stock: number
    }

    export interface Category {
        slug: string
        title: string
    }

    export interface Color {
        id: number
        name: string
        hex_code: string
        images: {
          id: number
          image: string
        }[]
    }

    export interface Size {
        id: number
        name: string
    }
    export interface Variants {
        id: number
        product: Item
        color: Color
        size: Size
        price: number
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

    export interface SizeChartItem {
        size: string;
        chest: number;
        waist: number;
        hips: number;
      }

    export interface SizeChart {
        category: string;
        values: SizeChartItem[];
      }

    export interface List {
        id: number
        product: Item
        main_image_of_variant: {
            id: number
            image: string
        }
        color: {
            id: number
            name: string
            hex_code: string
        }
    }
}
