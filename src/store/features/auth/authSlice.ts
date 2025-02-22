import { PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'

import $axios from '@/shared/api/axios'
import { API_URL } from '@/shared/utils/const'

import { RootState } from '../../store'

export type LoginUser = Pick<User, 'email'> & { password: string };
export type RegisterUser = Pick<User, 'email'> & { password: string };
export type PasswordReset = Pick<User, 'email'>;
export type ActivateUser = {
    email: string | null
    activation_code: string
};

export type PasswordResetConfirm = {
    email: string | null
    code: string
    new_password: string
};

interface User {
  email: string;
}
type ErrorMessage = Error | AxiosError | null;
interface Tokens {
  refresh: string;
  access: string;
}
interface AuthState {
  user: User | null;
  tokens: Tokens | null;
  isValidToken: boolean;
  error: ErrorMessage;
  isAuth: boolean;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  tokens: JSON.parse(localStorage.getItem('tokens') || 'null'),
  isValidToken: true,
  error: null,
  isAuth:
    !!JSON.parse(localStorage.getItem('tokens') || 'null') &&
    !!JSON.parse(localStorage.getItem('user') || 'null'),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state: AuthState, action: PayloadAction<User>) => {
      const user = JSON.stringify(action.payload)

      localStorage.setItem('user', user)
      state.user = action.payload
    },
    setTokens: (state: AuthState, action: PayloadAction<Tokens>) => {
      const tokens = JSON.stringify(action.payload)

      localStorage.setItem('tokens', tokens)
      state.tokens = action.payload
    },
    setLogout: (state: AuthState) => {
      localStorage.removeItem('tokens')
      localStorage.removeItem('user')
      state.tokens = null
      state.user = null
      state.isAuth = false
    },

    setIsValidToken(state: AuthState, action: PayloadAction<boolean>) {
      state.isValidToken = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, () => {})
    builder.addCase(login.fulfilled, (state) => {
      state.isAuth = true
    })
    builder.addCase(register.rejected, (state) => {
      state.isAuth = false
    })
  },
})

export const login = createAsyncThunk<unknown, LoginUser>(
  'auth/login',
  async (data: LoginUser, { dispatch, rejectWithValue }) => {
    try {
      const { data: response } = await $axios.post(`${API_URL}/users/login/`, data)

      const { refresh, access, user } = response

      dispatch(authSlice.actions.setTokens({ refresh, access }))
      dispatch(authSlice.actions.setUser(user))
    } catch (error) {
      const err = error as AxiosError

      return rejectWithValue(err.response)
    }
  },
)

export const register = createAsyncThunk<unknown, RegisterUser>(
  'auth/register',
  async (data: RegisterUser, { rejectWithValue }) => {
    try {
      const response = await $axios.post(`${API_URL}/users/registration/`, data)

      return response.data
    } catch (error) {
      const err = error as AxiosError

      return rejectWithValue(err.response)
    }
  },
)

export const activateUser = createAsyncThunk<unknown, ActivateUser>(
  'auth/register',
  async (data: ActivateUser, { dispatch, rejectWithValue }) => {
    try {
      const { data: response } = await $axios.post(`${API_URL}/users/activation/`, data)

      const { refresh, access, user } = response

      dispatch(authSlice.actions.setTokens({ refresh, access }))
      dispatch(authSlice.actions.setUser(user))
    } catch (error) {
      const err = error as AxiosError

      return rejectWithValue(err.response)
    }
  },
)

export const passwordReset = createAsyncThunk<unknown, PasswordReset>(
  'auth/register',
  async (data: PasswordReset, { rejectWithValue }) => {
    try {
      await $axios.post(`${API_URL}/users/password-reset/`, data)

    } catch (error) {
      const err = error as AxiosError

      return rejectWithValue(err.response)
    }
  },
)

export const passwordResetConfirm = createAsyncThunk<unknown, PasswordResetConfirm>(
  'auth/register',
  async (data: PasswordResetConfirm, { rejectWithValue }) => {
    try {
      await $axios.post(`${API_URL}/users/password-reset-confirm/`, data)
    } catch (error) {
      const err = error as AxiosError

      return rejectWithValue(err.response)
    }
  },
)

export const refreshToken = createAsyncThunk<unknown, void>(
  'auth/refresh',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const refresh = state.auth.tokens?.refresh

      const { data } = await $axios.post(`${API_URL}/users/refresh/`, {
        refresh,
      })

      if (!state.auth.isValidToken) {
        authSlice.actions.setTokens(data)
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response!.data.message)
      }
    }
  },
)

export const userMe = createAsyncThunk<unknown, void>(
  'auth/userMe',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.tokens?.refresh

      const { data: user } = await $axios.get(`${API_URL}/users/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      dispatch(setUser(user))
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response!.data.message)
      }
    }
  },
)

export const { setUser, setLogout } = authSlice.actions
export default authSlice.reducer
