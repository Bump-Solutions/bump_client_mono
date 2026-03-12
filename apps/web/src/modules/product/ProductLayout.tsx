import { Outlet } from "react-router";
import ProductProvider from "../../context/product/ProductProvider";

const ProductLayout = () => {
  return (
    <ProductProvider>
      <Outlet />
    </ProductProvider>
  );
};

export default ProductLayout;
