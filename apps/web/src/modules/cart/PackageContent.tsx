import { usePackage } from "../../context/cart/usePackage";
import PackageProduct from "./PackageProduct";

const PackageContent = () => {
  const { pkg } = usePackage();

  if (pkg.products.length === 0) return null;

  return (
    <ul className='package__content'>
      {pkg.products.map((product) => (
        <PackageProduct key={product.id} product={product} />
      ))}
    </ul>
  );
};

export default PackageContent;
