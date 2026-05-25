"use client";

import { useState } from "react";
import { View, Text, Button, Divider } from "reshaped";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ipfsUrl } from "@/lib/ipfs";

export function CartContents() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, isLoading, error } =
    useCart();
  const [operationLoading, setOperationLoading] = useState(false);

  // Show error if there is one
  if (error) {
    return (
      <View direction="column" align="center" padding={8} gap={4}>
        <Text variant="title-5">Error</Text>
        <Text variant="body-1">{error}</Text>
        <Link href="/shop">
          <Button variant="solid">Continue Shopping</Button>
        </Link>
      </View>
    );
  }

  // Check if cart is empty
  if (!cart || cart.items.length === 0) {
    return (
      <View direction="column" align="center" padding={8} gap={4}>
        <Text variant="featured-1">Your cart is empty</Text>
        <Text variant="body-1" color="neutral-faded">
          Add some items to your cart and they will appear here.
        </Text>
        <Link href="/shop">
          <Button variant="solid" color="primary" size="xlarge" rounded={true}>
            <View paddingInline={12}>Shop</View>
          </Button>
        </Link>
      </View>
    );
  }

  // Handle remove item
  const handleRemoveItem = (productId: string) => {
    setOperationLoading(true);
    removeFromCart(productId);
    setOperationLoading(false);
  };

  // Handle update quantity
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setOperationLoading(true);
    updateQuantity(productId, quantity);
    setOperationLoading(false);
  };

  // Handle clear cart
  const handleClearCart = () => {
    setOperationLoading(true);
    clearCart();
    setOperationLoading(false);
  };

  // Proceed to checkout
  const handleCheckout = () => {
    router.push("/checkout");
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <View direction="column" gap={4} padding={4}>
      <Text variant="featured-2">Your Cart</Text>

      <View direction="row" justify="end">
        <Button
          variant="ghost"
          onClick={handleClearCart}
          disabled={isLoading || operationLoading || cart.items.length === 0}
        >
          Clear Cart
        </Button>
      </View>

      <View direction="column" gap={2}>
        {cart.items.map((item) => (
          <View
            key={item.id}
            direction="row"
            gap={4}
            align="center"
            padding={4}
            borderRadius="medium"
            backgroundColor="page"
          >
            {/* Product Image */}
            <View
              width="80px"
              height="80px"
              borderRadius="medium"
              overflow="hidden"
              attributes={{ style: { flexShrink: 0 } }}
            >
              <Image
                src={ipfsUrl(item.product.photoUrl)}
                alt={item.product.name}
                fill
                sizes="80px"
                style={{ objectFit: "cover" }}
              />
            </View>

            {/* Product Details */}
            <View
              direction="column"
              gap={1}
              attributes={{ style: { flex: 1 } }}
            >
              <Text variant="body-1" weight="medium" maxLines={2}>
                {item.product.name}
              </Text>
              <Text variant="body-2" color="neutral-faded">
                {formatPrice(item.price)} each
              </Text>

              <QuantitySelector
                quantity={item.quantity}
                onIncrease={() =>
                  handleUpdateQuantity(item.productId, item.quantity + 1)
                }
                onDecrease={() =>
                  handleUpdateQuantity(
                    item.productId,
                    Math.max(1, item.quantity - 1),
                  )
                }
                onRemove={() => handleRemoveItem(item.productId)}
                disabled={isLoading || operationLoading}
                size="small"
                showRemoveButton={true}
              />
            </View>

            {/* Total Price */}
            <View align="end" attributes={{ style: { flexShrink: 0 } }}>
              <Text variant="body-1" weight="medium">
                {formatPrice(item.price * item.quantity)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Divider />

      <View direction="row" justify="space-between" padding={2}>
        <Text variant="title-6">Total</Text>
        <Text variant="title-6">{formatPrice(cart.total)}</Text>
      </View>

      <View direction="row" justify="end" gap={2}>
        <Link href="/shop">
          <Button variant="outline" disabled={isLoading || operationLoading}>
            Continue Shopping
          </Button>
        </Link>
        <Button
          variant="solid"
          onClick={handleCheckout}
          disabled={isLoading || operationLoading}
        >
          Checkout
        </Button>
      </View>
    </View>
  );
}
