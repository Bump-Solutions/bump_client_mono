import "../../styles/css/order.css";

import { displayUuid, ENUM } from "@bump/utils";
import { useTitle } from "react-use";
import { useOrder } from "../../context/order/useOrder";

import Back from "../../components/Back";
import Spinner from "../../components/Spinner";
import ConnectStripeBanner from "../stripe/ConnectStripeBanner";
import OrderHeader from "./OrderHeader";

const Order = () => {
  const { order, isLoading } = useOrder();
  const pretty = displayUuid(order?.uuid || "");

  useTitle(`Rendelés ${pretty} - ${ENUM.BRAND.NAME}`);

  if (isLoading) return <Spinner />;

  return (
    <section className='order'>
      <Back text='Vissza a rendelésekhez' className='link mb-1' />
      <ConnectStripeBanner />

      <OrderHeader pretty={pretty} />

      <div>{JSON.stringify(order, null, 2)}</div>
    </section>
  );
};

export default Order;
