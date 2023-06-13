export type Category = {
    id: string;
    name: string;
};
export type Product = {
    id: string,
    name: string,
    price: number,
    image: string,
    des: string,
    category_id: string,
    stars: number
}
export type Size = {
    id: string;
    name: string;
};
export type Cart = {
    productId: string;
    quantity: number;
    sizeId: string;
    id:string,
    productName: string,
    productImage: string,
    productPrice: number,
    sizeName: string
};
export type Order = {
    id: string,
    totalAmount:number,
    address:string,
    phone:string,
    note:string,
    orderDate:Date
};