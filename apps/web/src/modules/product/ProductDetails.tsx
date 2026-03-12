import { clampDiscount } from "@bump/utils";
import { Link } from "react-router";
import { useProduct } from "../../context/product/useProduct";
import { useFacetedSearch } from "../../hooks/product/useFacetedSearch";
import { ROUTES } from "../../routes/routes";

import Badges from "../../components/Badges";
import Stepper from "../../components/Stepper";
import FacetedSearch from "./FacetedSearch";
import PriceTag from "./PriceTag";
import ProductActions from "./ProductActions";

const ProductDetails = () => {
  const { product } = useProduct();
  const facets = useFacetedSearch();

  if (!product || !facets.hasProduct) return null;

  const LABEL = [
    product.product.brand,
    product.product.model,
    product.product.colorWay,
  ].join(" ");

  const discountValue = clampDiscount(
    product.badges.discount?.value as number | undefined,
  );

  return (
    <article className='product__details'>
      <Badges badges={product.badges} initialToggle={true} showToggle={false} />

      <h1 className='mb-0_5'>{LABEL}</h1>
      {product.description && (
        <p
          className='fc-gray-700 ta-justify fs-16'
          style={{ whiteSpace: "pre-line" }}>
          {product.description}
        </p>
      )}

      {facets.hasAvailableItems ? (
        <>
          <FacetedSearch {...facets} />

          <div className='product__quantity'>
            <h4>
              Darabszám{" "}
              {facets?.filteredCount > 0 && (
                <span className='fc-gray-600'>
                  - max {facets.filteredCount} db
                </span>
              )}
            </h4>
            <Stepper
              value={facets.quantity}
              min={1}
              max={facets.filteredCount}
              onChange={(value: number) => facets.setQuantity(value)}
              disabled={facets.filteredCount === 0}
            />
          </div>

          <PriceTag discount={discountValue} {...facets} />

          <ProductActions {...facets} />

          <Link to={ROUTES.HOME} className='link ml-auto py-0_5 fs-14 fw-600'>
            Hogyan működik?
          </Link>
        </>
      ) : (
        <div className='product__no-items'>
          TODO: Nincsenek elérhető tételek.
        </div>
      )}
    </article>
  );
};

export default ProductDetails;
