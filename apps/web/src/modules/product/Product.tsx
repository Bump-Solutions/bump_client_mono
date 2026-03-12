import "../../styles/css/product.css";

import { useTitle } from "react-use";
import { useProduct } from "../../context/product/useProduct";

import Back from "../../components/Back";
import ProductDetails from "./ProductDetails";
import Thumbnail from "./Thumbnail";

const Product = () => {
  const { product } = useProduct();

  useTitle(`${product.title} - Bump`);

  return (
    <section className='product'>
      <Back text='Vissza' />
      <div className='product__content'>
        <Thumbnail />
        <ProductDetails />
      </div>
    </section>
  );
};

export default Product;
