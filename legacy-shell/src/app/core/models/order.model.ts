export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  reference: string
  customerName: string
  totalAmount: number
  status: OrderStatus
  createdAt: string
}
