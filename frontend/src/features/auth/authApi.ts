import { apiClient } from "./../../app/apiClient";
import type {
  LoginPayloadType,
  LoginResponseType,
  RegisterPayloadType,
} from "./authType";

export const authApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<void, RegisterPayloadType>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation<LoginResponseType, LoginPayloadType>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;