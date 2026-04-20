import "../../styles/css/order.css";

import { ENUM } from "@bump/utils";
import { useTitle } from "react-use";
import { useOrder } from "../../context/order/useOrder";

import Back from "../../components/Back";
import ConnectStripeBanner from "../stripe/ConnectStripeBanner";
import OrderContent from "./OrderContent";
import OrderHeader from "./OrderHeader";

const Order = () => {
  const { pretty } = useOrder();

  useTitle(`Rendelés ${pretty} - ${ENUM.BRAND.NAME}`);

  return (
    <section className='order'>
      <Back text='Vissza a rendelésekhez' className='link mb-1' />
      <ConnectStripeBanner />

      <OrderHeader />

      <OrderContent />
    </section>
  );
};

export default Order;
