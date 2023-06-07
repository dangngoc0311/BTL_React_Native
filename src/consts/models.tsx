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