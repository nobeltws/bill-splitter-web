"use client";

import { styled } from "@linaria/react";
import { Trash2 } from "lucide-react";

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 60px 80px 40px;
  gap: 8px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border);
`;

const ItemInput = styled.input`
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 14px;
  font-family: inherit;
  background: var(--color-card);
  min-height: 40px;
  width: 100%;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--color-muted-foreground);
  min-width: 40px;
  min-height: 40px;

  &:hover {
    color: var(--color-error);
  }
`;

interface ItemRowProps {
  name: string;
  quantity: string;
  unitPrice: string;
  onChange: (field: "name" | "quantity" | "unitPrice", value: string) => void;
  onDelete: () => void;
}

export function ItemRow({
  name,
  quantity,
  unitPrice,
  onChange,
  onDelete,
}: ItemRowProps) {
  return (
    <Row>
      <ItemInput
        value={name}
        onChange={(e) => onChange("name", e.target.value)}
        placeholder="Item name"
      />
      <ItemInput
        type="number"
        inputMode="numeric"
        value={quantity}
        onChange={(e) => onChange("quantity", e.target.value)}
        min={1}
      />
      <ItemInput
        type="number"
        inputMode="decimal"
        value={unitPrice}
        onChange={(e) => onChange("unitPrice", e.target.value)}
        min={0}
        step={0.01}
      />
      <DeleteButton onClick={onDelete} aria-label="Delete item">
        <Trash2 size={18} />
      </DeleteButton>
    </Row>
  );
}
