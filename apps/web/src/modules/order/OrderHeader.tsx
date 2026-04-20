import { OrderState, OrderUserRole } from "@bump/core/models";
import {
  ORDER_STATE_LABELS,
  ORDER_STATE_VARIANTS,
} from "@bump/core/presentation";
import { useOrder } from "../../context/order/useOrder";

const OrderHeaderBadge = ({
  state,
  role,
}: {
  state: OrderState;
  role: OrderUserRole;
}) => {
  const variantMap = ORDER_STATE_VARIANTS(role);
  const variant = variantMap[state] ?? "neutral";
  const label = ORDER_STATE_LABELS[state] ?? "Ismeretlen";

  return <span className={`badge ${variant}`}>{label}</span>;
};

const OrderHeader = () => {
  const { order, pretty } = useOrder();

  const role: OrderUserRole = order.isSeller
    ? OrderUserRole.SELLER
    : OrderUserRole.BUYER;

  return (
    <header className='order__header'>
      <div>
        <h1>
          Rendelés <b className='fc-blue-500 fw-700'>{pretty}</b>
        </h1>
        <OrderHeaderBadge state={order.state} role={role} />
      </div>
    </header>
  );
};

export default OrderHeader;
