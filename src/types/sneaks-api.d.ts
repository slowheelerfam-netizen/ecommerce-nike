declare module 'sneaks-api' {
  export default class SneaksAPI {
    getProducts(keyword: string, limit: number, cb: (err: unknown, products: any[]) => void): void;
    getProductPrices(styleID: string, cb: (err: unknown, product: any) => void): void;
    getMostPopular(limit: number, cb: (err: unknown, products: any[]) => void): void;
  }
}
