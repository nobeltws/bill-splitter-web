"use client";

import { styled } from "@linaria/react";
import { Minus, Plus } from "lucide-react";

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.p`
  font-size: 14px;
  font-weight: 600;
`;

const ItemMeta = styled.p`
  font-size: 13px;
  color: var(--color-muted-foreground);
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const QtyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: var(--color-card);
  cursor: pointer;
  color: var(--color-foreground);
  -webkit-tap-highlight-color: transparent;

  @media (pointer: coarse) {
    width: 44px;
    height: 44px;
  }

  &:hover {
    background: var(--color-muted);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const QtyDisplay = styled.span`
  font-size: 16px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
`;

interface ClaimItemProps {
  name: string;
  unitPrice: number;
  availableQty: number;
  claimedQty: number;
  onQuantityChange: (qty: number) => void;
}

export function ClaimItem({
  name,
  unitPrice,
  availableQty,
  claimedQty,
  onQuantityChange,
}: ClaimItemProps) {
  return (
    <Row>
      <ItemInfo>
        <ItemName>{name}</ItemName>
        <ItemMeta>
          ${unitPrice.toFixed(2)} each &middot; {availableQty} available
        </ItemMeta>
      </ItemInfo>
      <Controls>
        <QtyButton
          onClick={() => onQuantityChange(claimedQty - 1)}
          disabled={claimedQty <= 0}
          aria-label="Decrease quantity"
        >
          <Minus size={14} />
        </QtyButton>
        <QtyDisplay>{claimedQty}</QtyDisplay>
        <QtyButton
          onClick={() => onQuantityChange(claimedQty + 1)}
          disabled={claimedQty >= availableQty}
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </QtyButton>
      </Controls>
    </Row>
  );
}
