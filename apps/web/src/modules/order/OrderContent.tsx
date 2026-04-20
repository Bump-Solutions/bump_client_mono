import { useOrder } from "../../context/order/useOrder";

const OrderContent = () => {
  const { order } = useOrder();

  console.log("Order content:", order);

  return <div className='order__content'></div>;
};

export default OrderContent;
