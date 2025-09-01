import { api } from "@/state/services/authService";

// Types based on backend validators and model
export type GeoPoint = { type?: "Point"; coordinates: [number, number] };
export type OrderStatus = "pending" | "in_progress" | "ready" | "completed";

export type Order = {
  id: string;
  customer: string;
  serviceType: string;
  pickupDate: string; // ISO
  pickupTime: string; // "14:00" or "2:00 PM"
  deliveryDate: string;
  deliveryTime: string;
  pickupLocation?: GeoPoint;
  pickupAddress?: string;
  pickupPlaceId: string;
  deliveryLocation?: GeoPoint;
  deliveryAddress?: string;
  deliveryPlaceId: string;
  instructions?: string;
  garmentCount: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderPayload = {
  serviceType: string;
  pickupDate: string;
  pickupTime: string;
  deliveryDate: string;
  deliveryTime: string;
  pickupLocation?: GeoPoint;
  pickupAddress?: string;
  pickupPlaceId: string;
  deliveryLocation?: GeoPoint;
  deliveryAddress?: string;
  deliveryPlaceId: string;
  instructions?: string;
  garmentCount: number;
  totalPrice: number;
  status: OrderStatus;
};

export async function createOrder(payload: CreateOrderPayload): Promise<{ order: Order }> {
  const { data } = await api.post<{ order: Order }>(`/orders`, payload);
  return data;
}

export async function listMyOrders(params?: { page?: number; limit?: number; status?: OrderStatus }): Promise<{ page: number; limit: number; total: number; orders: Order[] }> {
  const { data } = await api.get(`/orders/my`, { params });
  return data as any;
}

export async function getMyOrder(id: string): Promise<{ order: Order }> {
  const { data } = await api.get<{ order: Order }>(`/orders/${id}`);
  return data;
}

export async function updateMyOrder(id: string, patch: Partial<CreateOrderPayload>): Promise<{ order: Order }> {
  const { data } = await api.patch<{ order: Order }>(`/orders/${id}`, patch);
  return data;
}

