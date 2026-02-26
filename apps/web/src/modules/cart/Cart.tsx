import "../../styles/css/cart.css";

import { ENUM } from "@bump/utils";
import { useState } from "react";
import { useTitle } from "react-use";
import { useCart } from "../../context/cart/useCart";
import { ROUTES } from "../../routes/routes";

import { ArrowUpRight, Globe } from "lucide-react";
import { Link } from "react-router";

import CartContent from "./CartContent";
import CartHeader from "./CartHeader";

import Back from "../../components/Back";
import Empty from "../../components/Empty";
import Spinner from "../../components/Spinner";

const Cart = () => {
  useTitle(`Kosár - ${ENUM.BRAND.NAME}`);

  const { cart, isLoading } = useCart();

  const [searchKey, setSearchKey] = useState<string>("");

  if (isLoading) {
    return (
      <div className='relative py-5'>
        <Spinner />
      </div>
    );
  }

  return cart && cart.packages.length > 0 ? (
    <section className='cart'>
      <Back to={ROUTES.HOME} text='Vásárlás folytatása' className='link mb-1' />
      <CartHeader searchKey={searchKey} setSearchKey={setSearchKey} />

      <CartContent searchKey={searchKey} />
    </section>
  ) : (
    <section className='cart empty'>
      <Back text='Vissza' className='link mb-1' />
      <CartHeader searchKey={searchKey} setSearchKey={setSearchKey} />

      <Empty
        title='A kosarad üres'
        description='Válogass több eladótól, kombináld a tételeket, és hozd létre a saját
            termékcsomagjaidat.'>
        <Link to={ROUTES.HOME} className='button primary w-fc mx-auto mb-1_5'>
          <Globe />
          Böngéssz a {ENUM.BRAND.WHERE}
        </Link>
        <Link
          to={ROUTES.HOME}
          target='_blank'
          className='link blue no-anim fw-600'>
          Tudj meg többet <ArrowUpRight />
        </Link>
      </Empty>
    </section>
  );
};

export default Cart;
