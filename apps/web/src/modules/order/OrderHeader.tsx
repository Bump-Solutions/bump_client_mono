import { useOrder } from "@/context/order/useOrder";
import {
  ORDER_ACTION_LABELS,
  ORDER_STATE_LABELS,
  ORDER_STATE_VARIANTS,
} from "@bump/core/presentation";

const OrderHeaderBadge = () => {
  const { order, role, machineState, pendingAction, error } = useOrder();

  if (machineState === "error" && error) {
    return <span className='badge critical'>Hiba</span>;
  }

  if (machineState === "executingAction" && pendingAction !== null) {
    return (
      <span className='badge info'>{ORDER_ACTION_LABELS[pendingAction]}…</span>
    );
  }

  if (machineState === "awaitingSystem") {
    return <span className='badge info'>Feldolgozás alatt</span>;
  }

  const variant = ORDER_STATE_VARIANTS(role)[order.state] ?? "neutral";
  const label = ORDER_STATE_LABELS[order.state] ?? "Ismeretlen";
  return <span className={`badge ${variant}`}>{label}</span>;
};

const OrderHeader = () => {
  const { pretty } = useOrder();
  return (
    <header className='order__header'>
      <div>
        <h1>
          Rendelés <b className='fc-blue-500 fw-700'>{pretty}</b>
        </h1>
        <OrderHeaderBadge />
      </div>
    </header>
  );
};

export default OrderHeader;
