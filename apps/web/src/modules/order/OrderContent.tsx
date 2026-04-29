import { useOrder } from "@/context/order/useOrder";
import { useOrderActions } from "@/hooks/order/useOrderAction";

import type { OrderMachineEvent } from "@bump/core/machines";
import { OrderAction, type OrderState } from "@bump/core/models";
import {
  ORDER_ACTION_LABELS,
  ORDER_STATE_LABELS,
} from "@bump/core/presentation";
import { useEffect } from "react";

// Action enum value → corresponding machine event
const eventForAction = (action: OrderAction): OrderMachineEvent => {
  switch (action) {
    case OrderAction.CONFIRM_ORDER:
      return { type: "CONFIRM_ORDER" };
    case OrderAction.INITIATE_CHECKOUT:
      return { type: "INITIATE_CHECKOUT" };
    case OrderAction.GET_ORDER_PAYMENT_STATUS:
      return { type: "GET_PAYMENT_STATUS" };
    case OrderAction.GET_SHIPMENT_DETAILS:
      return { type: "GET_SHIPMENT_DETAILS" };
    case OrderAction.CANCEL_ORDER:
      return { type: "CANCEL_ORDER" };
    case OrderAction.SUBMIT_BUYER_RATING:
    case OrderAction.SUBMIT_SELLER_RATING:
      return { type: "SUBMIT_RATING" };
  }
};

// Payload-free events — safe to fire from raw debug buttons
type DebugEvent = Extract<
  OrderMachineEvent,
  { type: "RETRY" } | { type: "DISMISS_ERROR" }
>;

const OrderContent = () => {
  const {
    order,
    role,
    turn,
    isMyTurn,
    machineState,
    pendingAction,
    error,
    can,
    send,
  } = useOrder();
  const { dispatch } = useOrderActions();

  useEffect(() => {
    console.group("[order] state changed");
    console.log("machineState:", machineState);
    console.log("order.state:", ORDER_STATE_LABELS[order.state]);
    console.log("turn:", turn, "| role:", role, "| isMyTurn:", isMyTurn);
    console.log("pendingAction:", pendingAction);
    console.log("error:", error);
    console.log("validActions:", order.validActions);
    console.groupEnd();
  }, [
    machineState,
    order.state,
    order.validActions,
    turn,
    role,
    isMyTurn,
    pendingAction,
    error,
  ]);

  return (
    <div className='order__content' style={containerStyle}>
      <DebugPanel
        machineState={machineState}
        orderState={order.state}
        turn={turn}
        role={role}
        isMyTurn={isMyTurn}
        pendingAction={pendingAction}
        error={error}
        validActions={order.validActions}
      />

      <ActionGrid
        validActions={order.validActions}
        pendingAction={pendingAction}
        isExecuting={machineState === "executingAction"}
        can={can}
        onAction={dispatch}
      />

      <MachineEventControls send={send} />

      <RawJson order={order} />
    </div>
  );
};

// ---------------------------------------------------------------------------

const DebugPanel = ({
  machineState,
  orderState,
  turn,
  role,
  isMyTurn,
  pendingAction,
  error,
  validActions,
}: {
  machineState: string;
  orderState: OrderState;
  turn: string | null;
  role: string;
  isMyTurn: boolean;
  pendingAction: OrderAction | null;
  error: { kind: string; message: string } | null;
  validActions: OrderAction[];
}) => (
  <section style={panelStyle}>
    <h3 style={headingStyle}>State</h3>
    <dl style={dlStyle}>
      <Row label='machineState' value={<code>{machineState}</code>} />
      <Row label='order.state' value={ORDER_STATE_LABELS[orderState]} />
      <Row label='turn' value={turn ?? "—"} />
      <Row label='role' value={role} />
      <Row label='isMyTurn' value={isMyTurn ? "✓" : "—"} />
      <Row
        label='pendingAction'
        value={
          pendingAction !== null ? ORDER_ACTION_LABELS[pendingAction] : "—"
        }
      />
      <Row
        label='error'
        value={error ? `${error.kind}: ${error.message}` : "—"}
      />
      <Row
        label='validActions'
        value={
          validActions.map((a) => ORDER_ACTION_LABELS[a]).join(", ") || "—"
        }
      />
    </dl>
  </section>
);

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <>
    <dt style={dtStyle}>{label}</dt>
    <dd style={ddStyle}>{value}</dd>
  </>
);

// ---------------------------------------------------------------------------

const ActionGrid = ({
  validActions,
  pendingAction,
  isExecuting,
  can,
  onAction,
}: {
  validActions: OrderAction[];
  pendingAction: OrderAction | null;
  isExecuting: boolean;
  can: (event: OrderMachineEvent) => boolean;
  onAction: (action: OrderAction) => void;
}) => {
  if (validActions.length === 0) {
    return (
      <section style={panelStyle}>
        <h3 style={headingStyle}>Actions (server-allowed)</h3>
        <p style={hintStyle}>Server reports no valid actions.</p>
      </section>
    );
  }

  return (
    <section style={panelStyle}>
      <h3 style={headingStyle}>Actions (server-allowed)</h3>
      <div style={buttonGridStyle}>
        {validActions.map((action) => {
          const event = eventForAction(action);
          const accepted = can(event);
          const disabled = !accepted || isExecuting;
          const isPending = pendingAction === action && isExecuting;

          return (
            <button
              key={action}
              type='button'
              disabled={disabled}
              title={
                !accepted
                  ? `Machine does not accept ${event.type} in current state`
                  : undefined
              }
              onClick={() => {
                console.log("[order] dispatching action", action);
                onAction(action);
              }}
              style={buttonStyle}>
              {ORDER_ACTION_LABELS[action]}
              {isPending && " …"}
            </button>
          );
        })}
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------

const MachineEventControls = ({
  send,
}: {
  send: (event: OrderMachineEvent) => void;
}) => {
  const events: DebugEvent["type"][] = ["RETRY", "DISMISS_ERROR"];

  return (
    <section style={panelStyle}>
      <h3 style={headingStyle}>Machine controls (debug)</h3>
      <p style={hintStyle}>
        Force-fire raw events. Useful for testing recovery paths without API
        round-trips.
      </p>
      <div style={buttonGridStyle}>
        {events.map((type) => (
          <button
            key={type}
            type='button'
            onClick={() => {
              console.log("[order] forcing event", type);
              send({ type });
            }}
            style={buttonStyle}>
            send({type})
          </button>
        ))}
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------

const RawJson = ({ order }: { order: unknown }) => (
  <section style={panelStyle}>
    <h3 style={headingStyle}>Raw order</h3>
    <pre style={preStyle}>{JSON.stringify(order, null, 2)}</pre>
  </section>
);

// ---------------------------------------------------------------------------

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 13,
};

const panelStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: 8,
  padding: "12px 16px",
};

const headingStyle: React.CSSProperties = {
  margin: "0 0 8px",
  fontSize: 14,
  fontFamily: "system-ui, sans-serif",
};

const dlStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "140px 1fr",
  gap: "4px 12px",
  margin: 0,
};

const dtStyle: React.CSSProperties = {
  color: "#888",
};

const ddStyle: React.CSSProperties = {
  margin: 0,
};

const buttonGridStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const buttonStyle: React.CSSProperties = {
  padding: "6px 12px",
  border: "1px solid #ccc",
  borderRadius: 6,
  background: "white",
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: "inherit",
};

const hintStyle: React.CSSProperties = {
  margin: "0 0 8px",
  color: "#666",
  fontSize: 12,
};

const preStyle: React.CSSProperties = {
  margin: 0,
  padding: 8,
  background: "#f7f7f7",
  borderRadius: 4,
  fontSize: 11,
  overflow: "auto",
  maxHeight: 240,
};

export default OrderContent;
