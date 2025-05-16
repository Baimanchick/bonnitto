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
        promocode?: string
        delivery_method?: string
        payment_method?: string
        first_name?: string
        last_name?: string
        surname?: string
        comment?: string
        cdek_pvz_code?: string
        city?: number
        city_name?: string
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
    export interface Form {
        quantity: number
        variant: number
    }
}
