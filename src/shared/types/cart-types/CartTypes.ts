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
}
