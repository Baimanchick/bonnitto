export namespace MainImageTypes {
    export interface Item {
        slug: string
        image: string
        collection: {
            slug: string
            title: string
        }
        text: string | null
    }
}
