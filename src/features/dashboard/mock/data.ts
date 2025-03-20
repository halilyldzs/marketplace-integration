export interface Product {
  id: string
  name: string
  price: number
  soldCount: number
  marketplace: "Trendyol" | "Amazon" | "HepsiBurada"
}

export interface MarketplaceSales {
  marketplace: string
  totalSales: number
  orderCount: number
}

export const products: Product[] = [
  {
    id: "1",
    name: "iPhone 14 Pro",
    price: 39999,
    soldCount: 150,
    marketplace: "Trendyol",
  },
  {
    id: "2",
    name: "Samsung Galaxy S23",
    price: 34999,
    soldCount: 120,
    marketplace: "Amazon",
  },
  {
    id: "3",
    name: "MacBook Pro M2",
    price: 49999,
    soldCount: 85,
    marketplace: "Trendyol",
  },
  {
    id: "4",
    name: "AirPods Pro",
    price: 4999,
    soldCount: 200,
    marketplace: "HepsiBurada",
  },
  {
    id: "5",
    name: "iPad Air",
    price: 19999,
    soldCount: 95,
    marketplace: "Amazon",
  },
  {
    id: "6",
    name: "Apple Watch Series 8",
    price: 12999,
    soldCount: 75,
    marketplace: "Trendyol",
  },
]

export const marketplaceSales: MarketplaceSales[] = [
  {
    marketplace: "Trendyol",
    totalSales: 2500000,
    orderCount: 310,
  },
  {
    marketplace: "Amazon",
    totalSales: 1800000,
    orderCount: 215,
  },
  {
    marketplace: "HepsiBurada",
    totalSales: 1200000,
    orderCount: 200,
  },
]

export const monthlyOrders = [
  { month: "Ocak", orders: 150 },
  { month: "Şubat", orders: 180 },
  { month: "Mart", orders: 220 },
  { month: "Nisan", orders: 270 },
  { month: "Mayıs", orders: 310 },
  { month: "Haziran", orders: 290 },
]
