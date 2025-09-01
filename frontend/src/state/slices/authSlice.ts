import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/state/store";
import type { User } from "@/state/services/authService";
import * as AuthAPI from "@/state/services/authService";
import type { UpdateProfilePayload } from "@/state/services/authService";

type ApiErrorPayload =
  | string
  | { message?: string; errors?: Record<string, string> }
  | Record<string, string>;

export type AuthState = {
  user: User | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: ApiErrorPayload | null;
};

function loadFromStorage(): Pick<AuthState, "user" | "token"> {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return { user: null, token: null };
    const parsed = JSON.parse(raw);
    return { user: parsed.user ?? null, token: parsed.token ?? null };
  } catch {
    return { user: null, token: null };
  }
}

function saveToStorage(state: Pick<AuthState, "user" | "token">) {
  try {
    localStorage.setItem("auth", JSON.stringify(state));
  } catch {}
}

const initialPersisted = loadFromStorage();
if (initialPersisted.token) {
  AuthAPI.setAuthToken(initialPersisted.token);
}

const initialState: AuthState = {
  user: initialPersisted.user,
  token: initialPersisted.token,
  status: "idle",
  error: null,
};

// Centralized extraction of API error messages
function extractErrorPayload(err: any, fallback: string): ApiErrorPayload {
  const data = err?.response?.data;
  if (data && (typeof data === "object") && (data.errors || data.message)) return data;
  return fallback;
}

export const login = createAsyncThunk(
  "auth/login",
  async (payload: { number: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await AuthAPI.login(payload);
      return res;
    } catch (err: any) {
      return rejectWithValue(extractErrorPayload(err, "Login failed"));
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (payload: { name: string; number: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await AuthAPI.register(payload);
      return res;
    } catch (err: any) {
      return rejectWithValue(extractErrorPayload(err, "Registration failed"));
    }
  }
);

export const fetchMe = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
  try {
    const res = await AuthAPI.me();
    return res.user;
  } catch (err: any) {
    return rejectWithValue(extractErrorPayload(err, "Fetch me failed"));
  }
});

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (payload: UpdateProfilePayload, { rejectWithValue }) => {
    try {
      const res = await AuthAPI.updateMe(payload);
      return res.user;
    } catch (err: any) {
      return rejectWithValue(extractErrorPayload(err, "Update failed"));
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  async (_, { rejectWithValue }) => {
    try {
      const res = await AuthAPI.deleteMe();
      return res.message || "Account deleted";
    } catch (err: any) {
      return rejectWithValue(extractErrorPayload(err, "Delete failed"));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      saveToStorage({ user: null, token: null });
      AuthAPI.setAuthToken(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        saveToStorage({ user: state.user, token: state.token });
        AuthAPI.setAuthToken(state.token);
      })
      .addCase(login.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<{ token: string; user: User }>) => {
          state.status = "succeeded";
          state.user = action.payload.user;
          state.token = action.payload.token;
          saveToStorage({ user: state.user, token: state.token });
          AuthAPI.setAuthToken(state.token);
        }
      )
      .addCase(register.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload || "Registration failed";
      })
      .addCase(fetchMe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMe.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.user = action.payload;
        saveToStorage({ user: state.user, token: state.token });
      })
      .addCase(fetchMe.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.user = action.payload;
        saveToStorage({ user: state.user, token: state.token });
      })
      .addCase(updateProfile.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload || "Update failed";
      })
      .addCase(deleteAccount.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null;
        state.token = null;
        saveToStorage({ user: null, token: null });
        AuthAPI.setAuthToken(null);
      })
      .addCase(deleteAccount.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload || "Delete failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.token);
