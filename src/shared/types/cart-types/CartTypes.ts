import { ProductTypes } from '../products/ProductsTypes'

export namespace CartTypes {
    export interface Item {
        variant: number
        quantity: number
    }
    export interface OrderWithoutUserData {
        email: string
        phone_number: string
        address: string
        items: Item[]
    }
    export interface OrderWithUserData {
        email: string
        phone_number: string
        address: string
    }
    export interface Products {
        id: number
        quantity: number
        user: {
            id: number
            email: string
        }
        variant: {
            id: number
            product: ProductTypes.Item
            price: string
            stock: number
            color: {
                id: number
                name: string
                hex_code: string
            }
            size: {
                id: number
                name: string
            }
        }
    }
}
