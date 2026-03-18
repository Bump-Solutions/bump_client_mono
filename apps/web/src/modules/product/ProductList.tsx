import type { InventoryModel } from "@bump/core/models";
import type { PaginatedListProps } from "@bump/types";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Link, useLocation } from "react-router";
import { useProfile } from "../../context/profile/useProfile";
import { ROUTES } from "../../routes/routes";

import Spinner from "../../components/Spinner";
import ProductListItem from "./ProductListItem";

import { CirclePlus } from "lucide-react";

const ProductList = ({
  pages,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
}: PaginatedListProps<InventoryModel>) => {
  const location = useLocation();
  const { isOwnProfile } = useProfile();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, hasNextPage, isFetchingNextPage]);

  // Don't show the dummy product if we are on the saved products page
  const isSavedPage = location.pathname.includes("/saved");

  return (
    <>
      <ul className='products__list'>
        {/* If isOwnProfile, place a dummy ProductListItem to quick add a product */}
        {isOwnProfile && !isSavedPage && (
          <li className='dummy'>
            <Link to={ROUTES.SELL} state={{ background: location }}>
              <CirclePlus />
              <h4>Új termék feltöltése</h4>
            </Link>
          </li>
        )}

        {pages.map((page, index) => (
          <Fragment key={index}>
            {page.products.map((product, idx) => (
              <ProductListItem key={idx} product={product} />
            ))}
          </Fragment>
        ))}
      </ul>

      <div ref={ref}>
        {isFetchingNextPage && (
          <div className='relative py-3'>
            <Spinner />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;
