"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cartApi } from "@/features/cart/api/cart-api";
import type { Cart } from "@/features/cart/model/types";
import { useAuth } from "@/features/auth/hooks/use-auth";

type CartContextValue = {
  totalQuantity: number;
  syncCart: (cart: Pick<Cart, "totalQuantity"> | null) => void;
  refreshCart: () => Promise<void>;
};

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { status, user } = useAuth();
  const [cartState, setCartState] = useState({
    userId: null as string | null,
    totalQuantity: 0,
  });

  const syncCart = useCallback(
    (cart: Pick<Cart, "totalQuantity"> | null) =>
      setCartState({
        userId: user?.id ?? null,
        totalQuantity: cart?.totalQuantity ?? 0,
      }),
    [user?.id],
  );

  const refreshCart = useCallback(async () => {
    if (status !== "authenticated") {
      setCartState({ userId: null, totalQuantity: 0 });
      return;
    }
    const cart = await cartApi.get();
    setCartState({
      userId: user?.id ?? null,
      totalQuantity: cart.totalQuantity,
    });
  }, [status, user?.id]);

  useEffect(() => {
    if (status !== "authenticated") return;

    let active = true;
    cartApi
      .get()
      .then((cart) => {
        if (active) {
          setCartState({
            userId: user?.id ?? null,
            totalQuantity: cart.totalQuantity,
          });
        }
      })
      .catch(() => {
        if (active) {
          setCartState({ userId: user?.id ?? null, totalQuantity: 0 });
        }
      });

    return () => {
      active = false;
    };
  }, [status, user?.id]);

  const visibleTotalQuantity =
    status === "authenticated" && cartState.userId === user?.id
      ? cartState.totalQuantity
      : 0;
  const value = useMemo(
    () => ({ totalQuantity: visibleTotalQuantity, syncCart, refreshCart }),
    [refreshCart, syncCart, visibleTotalQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
