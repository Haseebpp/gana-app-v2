import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/state/store";
import type { CreateOrderPayload, Order, OrderStatus } from "@/state/services/orderService";
import { createOrder as apiCreateOrder, listMyOrders, getMyOrder, updateMyOrder } from "@/state/services/orderService";

// UI-only draft used by the multi-step flow. Maps closely to backend fields,
// but allows us to collect data across steps before submitting.
export type OrderDraft = {
  serviceType: string;
  garmentCount: number;
  express: boolean; // UI flag to help compute price; not sent directly

  pickupDate?: string;
  pickupTime?: string;
  pickupAddress?: string;
  pickupPlaceId?: string;

  deliveryDate?: string;
  deliveryTime?: string;
  deliveryAddress?: string;
  deliveryPlaceId?: string;

  instructions?: string;
};

type OrdersState = {
  draft: OrderDraft;
  // Read models
  items: Order[];
  current: Order | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
};

const initialState: OrdersState = {
  draft: { serviceType: "", garmentCount: 1, express: false },
  items: [],
  current: null,
  status: "idle",
};

// --- Async thunks mapping to backend routes -------------------------------
export const createOrder = createAsyncThunk(
  "orders/create",
  async (payload: CreateOrderPayload, { rejectWithValue }) => {
    try {
      const { order } = await apiCreateOrder(payload);
      return order;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to create order");
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "orders/listMy",
  async (params: { page?: number; limit?: number; status?: OrderStatus } | undefined, { rejectWithValue }) => {
    try {
      const data = await listMyOrders(params);
      return data.orders as Order[];
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load orders");
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/getOne",
  async (id: string, { rejectWithValue }) => {
    try {
      const { order } = await getMyOrder(id);
      return order;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load order");
    }
  }
);

export const patchOrder = createAsyncThunk(
  "orders/update",
  async ({ id, patch }: { id: string; patch: Partial<CreateOrderPayload> }, { rejectWithValue }) => {
    try {
      const { order } = await updateMyOrder(id, patch);
      return order;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to update order");
    }
  }
);

// --- Slice -----------------------------------------------------------------
const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetDraft(state) {
      state.draft = { serviceType: "", garmentCount: 1, express: false };
    },
    setServiceType(state, action: PayloadAction<string>) {
      state.draft.serviceType = action.payload;
    },
    setGarmentCount(state, action: PayloadAction<number>) {
      state.draft.garmentCount = Math.max(1, Math.floor(action.payload || 1));
    },
    setExpress(state, action: PayloadAction<boolean>) {
      state.draft.express = action.payload;
    },
    setPickup(state, action: PayloadAction<{ date?: string; time?: string; address?: string; placeId?: string }>) {
      state.draft.pickupDate = action.payload.date ?? state.draft.pickupDate;
      state.draft.pickupTime = action.payload.time ?? state.draft.pickupTime;
      state.draft.pickupAddress = action.payload.address ?? state.draft.pickupAddress;
      state.draft.pickupPlaceId = action.payload.placeId ?? state.draft.pickupPlaceId;
    },
    setDelivery(state, action: PayloadAction<{ date?: string; time?: string; address?: string; placeId?: string }>) {
      state.draft.deliveryDate = action.payload.date ?? state.draft.deliveryDate;
      state.draft.deliveryTime = action.payload.time ?? state.draft.deliveryTime;
      state.draft.deliveryAddress = action.payload.address ?? state.draft.deliveryAddress;
      state.draft.deliveryPlaceId = action.payload.placeId ?? state.draft.deliveryPlaceId;
    },
    setInstructions(state, action: PayloadAction<string | undefined>) {
      state.draft.instructions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(createOrder.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.current = payload;
        // Prepend to list for snappy UX
        state.items = [payload, ...state.items];
      })
      .addCase(createOrder.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = (payload as string) || "Failed to create order";
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchMyOrders.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.items = payload;
      })
      .addCase(fetchMyOrders.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = (payload as string) || "Failed to load orders";
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchOrderById.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.current = payload;
      })
      .addCase(fetchOrderById.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = (payload as string) || "Failed to load order";
      })
      .addCase(patchOrder.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(patchOrder.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.current = payload;
        // Merge into list if present
        const idx = state.items.findIndex((o) => o.id === payload.id);
        if (idx >= 0) state.items[idx] = payload;
      })
      .addCase(patchOrder.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = (payload as string) || "Failed to update order";
      });
  },
});

export const {
  resetDraft,
  setServiceType,
  setGarmentCount,
  setExpress,
  setPickup,
  setDelivery,
  setInstructions,
} = ordersSlice.actions;

export default ordersSlice.reducer;

// --- Selectors -------------------------------------------------------------
export const selectDraft = (s: RootState) => s.orders.draft;

// Basic pricing helper for the outline; adapt as needed.
const PRICES: Record<string, number> = {
  dry_cleaning: 8.99,
  wash_fold: 2.99, // per lb
  ironing: 4.99,
};

export const selectDraftPricing = (s: RootState) => {
  const d = s.orders.draft;
  const unit = PRICES[d.serviceType] ?? 0;
  const subtotal = unit * (d.garmentCount || 1);
  const expressFee = d.express ? subtotal * 0.5 : 0;
  const deliveryFee = subtotal > 0 ? 4.99 : 0; // example
  const total = Number((subtotal + expressFee + deliveryFee).toFixed(2));
  return { unit, subtotal, expressFee, deliveryFee, total };
};

