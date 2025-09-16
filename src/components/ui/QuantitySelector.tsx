'use client';

import { View, Text, Button } from 'reshaped';
import { Minus, Plus } from 'phosphor-react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove?: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium';
  showRemoveButton?: boolean;
}

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
  disabled = false,
  size = 'medium',
  showRemoveButton = false
}: QuantitySelectorProps) {
  const buttonSize = size === 'small' ? 'small' : 'medium';
  const textVariant = size === 'small' ? 'caption-1' : 'body-2';

  const handleDecrease = () => {
    if (quantity === 1 && onRemove) {
      onRemove();
    } else {
      onDecrease();
    }
  };

  return (
    <View direction="row" align="center" gap={2}>
      <Button
        variant="outline"
        size={buttonSize}
        rounded
        onClick={handleDecrease}
        disabled={disabled}
        attributes={{
          style: {
            minWidth: size === 'small' ? '32px' : '36px',
            height: size === 'small' ? '32px' : '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        }}
      >
        <Minus size={size === 'small' ? 14 : 16} />
      </Button>

      <View minWidth={size === 'small' ? '32px' : '40px'} align="center">
        <Text variant={textVariant} weight="medium">
          {quantity}
        </Text>
      </View>

      <Button
        variant="outline"
        size={buttonSize}
        rounded
        onClick={onIncrease}
        disabled={disabled}
        attributes={{
          style: {
            minWidth: size === 'small' ? '32px' : '36px',
            height: size === 'small' ? '32px' : '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        }}
      >
        <Plus size={size === 'small' ? 14 : 16} />
      </Button>

      {showRemoveButton && onRemove && (
        <Button
          variant="ghost"
          size={buttonSize}
          onClick={onRemove}
          disabled={disabled}
        >
          Remove
        </Button>
      )}
    </View>
  );
}