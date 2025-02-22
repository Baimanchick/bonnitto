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
    export interface Category {
        slug: string
        title: string
    }
}
