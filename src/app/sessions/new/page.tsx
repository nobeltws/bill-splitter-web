"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { styled } from "@linaria/react";
import { Plus } from "lucide-react";
import { Button } from "@/components/Button";
import { Input, InputGroup, Label } from "@/components/Input";
import { ItemRow } from "@/components/ItemRow";
import { useReceipt } from "@/context/ReceiptContext";
import { createSession } from "@/lib/api";

const Title = styled.h1`
	font-size: 24px;
	font-weight: 700;
	margin-bottom: 24px;
`;

const Section = styled.section`
	margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
	font-size: 16px;
	font-weight: 600;
	margin-bottom: 12px;
`;

const HeaderRow = styled.div`
	display: grid;
	grid-template-columns: 1fr 60px 80px 40px;
	gap: 8px;
	padding: 4px 0;
	font-size: 12px;
	font-weight: 600;
	color: var(--color-muted-foreground);
`;

const AddButton = styled.button`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px 16px;
	border: 1px dashed var(--color-border);
	border-radius: var(--radius);
	background: none;
	cursor: pointer;
	font-size: 14px;
	color: var(--color-primary);
	width: 100%;
	justify-content: center;
	min-height: 44px;
	margin-top: 8px;

	&:hover {
		background: var(--color-muted);
	}
`;

const Row = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 12px;
`;

const TotalCard = styled.div`
	background: var(--color-card);
	border: 1px solid var(--color-border);
	border-radius: var(--radius);
	padding: 16px;
	margin-bottom: 24px;
`;

const TotalRow = styled.div`
	display: flex;
	justify-content: space-between;
	font-size: 14px;
	padding: 4px 0;
	color: var(--color-muted-foreground);
`;

const TotalRowGrand = styled(TotalRow)`
	font-weight: 700;
	font-size: 16px;
	color: var(--color-foreground);
	border-top: 1px solid var(--color-border);
	margin-top: 8px;
	padding-top: 12px;
`;

const ErrorMessage = styled.p`
	color: var(--color-error);
	font-size: 14px;
	margin-bottom: 12px;
`;

interface EditableItem {
	name: string;
	quantity: string;
	unitPrice: string;
}

export default function SessionNewPage() {
	const { items: parsedItems, clear } = useReceipt();
	const router = useRouter();

	const [items, setItems] = useState<EditableItem[]>([]);
	const [serviceCharge, setServiceCharge] = useState("10");
	const [gst, setGst] = useState("9");
	const [discount, setDiscount] = useState("0");
	const [participantCount, setParticipantCount] = useState("1");
	const [paynowId, setPaynowId] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (parsedItems.length === 0) return;
		setItems(
			parsedItems.map((item) => ({
				name: item.name,
				quantity: String(item.quantity),
				unitPrice: String(item.unitPrice),
			})),
		);
	}, [parsedItems]);

	function updateItem(
		index: number,
		field: "name" | "quantity" | "unitPrice",
		value: string,
	) {
		setItems((prev) =>
			prev.map((item, i) =>
				i === index ? { ...item, [field]: value } : item,
			),
		);
	}

	function deleteItem(index: number) {
		setItems((prev) => prev.filter((_, i) => i !== index));
	}

	function addItem() {
		setItems((prev) => [...prev, { name: "", quantity: "1", unitPrice: "" }]);
	}

	async function handleSubmit() {
		const validItems = items
			.filter(
				(item) =>
					item.name.trim() &&
					Number(item.quantity) > 0 &&
					Number(item.unitPrice) > 0,
			)
			.map((item) => ({
				name: item.name,
				quantity: Number(item.quantity),
				unitPrice: Number(item.unitPrice),
			}));

		if (validItems.length === 0) {
			setError("Add at least one valid item");
			return;
		}
		if (!paynowId.trim()) {
			setError("Enter your mobile number for PayNow");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await createSession({
				hostPaynowId: paynowId.trim(),
				items: validItems,
				taxRate: (Number(gst) || 0) / 100,
				serviceChargeRate: (Number(serviceCharge) || 0) / 100,
				discount: Number(discount) || 0,
				participantCount: Number(participantCount) || 1,
			});
			clear();
			router.push(`/sessions/${response.sessionId}/dashboard`);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to create session",
			);
		} finally {
			setLoading(false);
		}
	}

	if (parsedItems.length === 0 && items.length === 0) {
		return (
			<div style={{ textAlign: "center", paddingTop: 64 }}>
				<p
					style={{
						marginBottom: 16,
						color: "var(--color-muted-foreground)",
					}}
				>
					Failed to extract from receipt or no receipt scanned yet.
				</p>
				<Button onClick={() => router.push("/")}>Scan a Receipt</Button>
			</div>
		);
	}

	return (
		<div>
			<Title>Review Your Bill</Title>

			<Section>
				<SectionTitle>Items</SectionTitle>
				<HeaderRow>
					<span>Name</span>
					<span>Qty</span>
					<span>Price</span>
					<span></span>
				</HeaderRow>
				{items.map((item, index) => (
					<ItemRow
						key={index}
						name={item.name}
						quantity={item.quantity}
						unitPrice={item.unitPrice}
						onChange={(field, value) =>
							updateItem(index, field, value)
						}
						onDelete={() => deleteItem(index)}
					/>
				))}
				<AddButton onClick={addItem}>
					<Plus size={16} /> Add Item
				</AddButton>
			</Section>

			{(() => {
				const subtotal = items.reduce(
					(sum, item) =>
						sum +
						(Number(item.quantity) || 0) *
							(Number(item.unitPrice) || 0),
					0,
				);
				const svcAmt = (subtotal * (Number(serviceCharge) || 0)) / 100;
				const gstAmt = ((subtotal + svcAmt) * (Number(gst) || 0)) / 100;
				const discountAmt = Number(discount) || 0;
				const grandTotal = subtotal + svcAmt + gstAmt - discountAmt;
				return (
					<TotalCard>
						<TotalRow>
							<span>Subtotal</span>
							<span>${subtotal.toFixed(2)}</span>
						</TotalRow>
						{Number(serviceCharge) > 0 && (
							<TotalRow>
								<span>Service Charge ({serviceCharge}%)</span>
								<span>${svcAmt.toFixed(2)}</span>
							</TotalRow>
						)}
						{Number(gst) > 0 && (
							<TotalRow>
								<span>GST ({gst}%)</span>
								<span>${gstAmt.toFixed(2)}</span>
							</TotalRow>
						)}
						{discountAmt > 0 && (
							<TotalRow>
								<span>Discount</span>
								<span>-${discountAmt.toFixed(2)}</span>
							</TotalRow>
						)}
						<TotalRowGrand>
							<span>Total</span>
							<span>${grandTotal.toFixed(2)}</span>
						</TotalRowGrand>
					</TotalCard>
				);
			})()}

			<Section>
				<SectionTitle>Charges</SectionTitle>
				<Row>
					<InputGroup>
						<Label htmlFor="serviceCharge">Service Charge %</Label>
						<Input
							id="serviceCharge"
							type="number"
							inputMode="decimal"
							value={serviceCharge}
							onChange={(e) => setServiceCharge(e.target.value)}
							min={0}
							max={100}
						/>
					</InputGroup>
					<InputGroup>
						<Label htmlFor="gst">GST %</Label>
						<Input
							id="gst"
							type="number"
							inputMode="decimal"
							value={gst}
							onChange={(e) => setGst(e.target.value)}
							min={0}
							max={100}
						/>
					</InputGroup>
				</Row>
				<InputGroup style={{ marginTop: 12 }}>
					<Label htmlFor="discount">Discount ($)</Label>
					<Input
						id="discount"
						type="number"
						inputMode="decimal"
						value={discount}
						onChange={(e) => setDiscount(e.target.value)}
						min={0}
						step={0.01}
					/>
				</InputGroup>
			</Section>

			<Section>
				<SectionTitle>Participants</SectionTitle>
				<InputGroup>
					<Label htmlFor="participantCount">
						Number of participants
					</Label>
					<Input
						id="participantCount"
						type="number"
						inputMode="numeric"
						value={participantCount}
						onChange={(e) => setParticipantCount(e.target.value)}
						min={1}
					/>
				</InputGroup>
			</Section>

			<Section>
				<SectionTitle>Your PayNow</SectionTitle>
				<InputGroup>
					<Label htmlFor="paynowId">Mobile number</Label>
					<Input
						id="paynowId"
						type="tel"
						inputMode="tel"
						value={paynowId}
						onChange={(e) => setPaynowId(e.target.value)}
						placeholder="91234567"
					/>
				</InputGroup>
			</Section>

			{error && <ErrorMessage>{error}</ErrorMessage>}

			<Button onClick={handleSubmit} disabled={loading}>
				{loading ? "Creating..." : "Create Session"}
			</Button>
		</div>
	);
}
