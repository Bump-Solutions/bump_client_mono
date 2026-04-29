import type { ProductListModel } from "@bump/core/models";
import { buildListPriceLabels } from "@bump/utils";
import { AnimatePresence } from "framer-motion";
import { useCallback, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useLongPress, useToggle } from "react-use";
import { toast } from "sonner";
import { useProfile } from "@/context/profile/useProfile";
import { useBodyScrollLock } from "@/hooks/common/useBodyScrollLock";
import { useLikeProduct } from "@/hooks/product/useLikeProduct";
import { useUnlikeProduct } from "@/hooks/product/useUnlikeProduct";
import { ROUTES } from "@/routes/routes";

import Badges from "@/components/Badges";
import Carousel from "./Carousel";
import ProductContextMenu from "./ProductContextMenu";

import {
  Bookmark,
  EllipsisVertical,
  Heart,
  Images,
  Percent,
} from "lucide-react";
import { useSaveProduct } from "@/hooks/product/useSaveProduct";
import { useUnsaveProduct } from "@/hooks/product/useUnsaveProduct";

type ProductListItemProps = {
  product: ProductListModel;
  onRequestDelete: (product: ProductListModel) => void;
};

const ProductListItem = ({
  product,
  onRequestDelete,
}: ProductListItemProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { isOwnProfile } = useProfile();

  const [isContextMenuOpen, toggleContextMenu] = useToggle(false);

  useBodyScrollLock(isContextMenuOpen, { disablePointerEvents: true });

  const handleRequestDelete = useCallback(() => {
    onRequestDelete(product);
  }, [onRequestDelete, product]);

  const onLongPress = useCallback(() => {
    toggleContextMenu(true);
  }, [toggleContextMenu]);

  const longPressEvent = useLongPress(onLongPress, {
    isPreventDefault: true,
    delay: 500,
  });

  const likeMutation = useLikeProduct();
  const unlikeMutation = useUnlikeProduct();

  const saveMutation = useSaveProduct();
  const unsaveMutation = useUnsaveProduct();

  const handleLike = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      e.preventDefault();

      if (!product.liked) {
        if (likeMutation.isPending) return;
        const likePromise = likeMutation.mutateAsync({
          product,
          ownerId: product.userId,
        });

        toast.promise(likePromise, {
          loading: "Kedvelés...",
          success: () => (
            <span>
              Kedveltél egy{" "}
              <Link
                target='_blank'
                className='link fc-green-600 underline fw-700'
                to={ROUTES.PRODUCT(product.id).ROOT}>
                terméket.
              </Link>
            </span>
          ),
          error: () => "Hiba történt a termék kedvelése során.",
        });
      } else {
        if (unlikeMutation.isPending) return;
        unlikeMutation.mutateAsync({ product, ownerId: product.userId });
      }
    },
    [product, likeMutation, unlikeMutation],
  );

  const handleSave = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      e.preventDefault();

      if (!product.saved) {
        if (saveMutation.isPending) return;
        const savePromise = saveMutation.mutateAsync({
          product,
          ownerId: product.userId,
        });

        toast.promise(savePromise, {
          loading: "Mentés...",
          success: () => (
            <span>
              Elmentettél egy{" "}
              <Link
                target='_blank'
                className='link fc-green-600 underline fw-700'
                to={ROUTES.PRODUCT(product.id).ROOT}>
                terméket.
              </Link>
            </span>
          ),
          error: () => "Hiba történt a termék mentése során.",
        });
      } else {
        if (unsaveMutation.isPending) return;
        unsaveMutation.mutateAsync({ product, ownerId: product.userId });
      }
    },
    [product, saveMutation, unsaveMutation],
  );

  const handleContextClick = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      e.preventDefault();
      e.stopPropagation();
      toggleContextMenu(true);
    },
    [toggleContextMenu],
  );

  const handleDiscountClick = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      e.preventDefault();
      e.stopPropagation();
      navigate(ROUTES.PRODUCT(product.id).DISCOUNT, {
        state: { background: location },
      });
    },
    [navigate, product.id, location],
  );

  return (
    <>
      <li className='product__item'>
        <AnimatePresence mode='wait'>
          {isContextMenuOpen && (
            <ProductContextMenu
              product={product}
              toggleContextMenu={toggleContextMenu}
              onDelete={handleRequestDelete}
            />
          )}
        </AnimatePresence>

        <Link to={ROUTES.PRODUCT(product.id).ROOT} {...longPressEvent}>
          <div className='product__item-header'>
            <span
              className='product__item-actions'
              role='button'
              tabIndex={0}
              aria-label='Termék menü'
              onClick={handleContextClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleContextClick(
                    e as unknown as MouseEvent<HTMLSpanElement>,
                  );
                }
              }}>
              <EllipsisVertical strokeWidth={3} />
            </span>

            {isOwnProfile && !product.discountedPrice && (
              <span
                className='product__item-actions discount'
                role='button'
                tabIndex={0}
                aria-label='Kedvezmény hozzáadása'
                onClick={handleDiscountClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleDiscountClick(
                      e as unknown as MouseEvent<HTMLSpanElement>,
                    );
                  }
                }}>
                <Percent />
              </span>
            )}

            {Object.keys(product.badges).length > 0 && (
              <Badges badges={product.badges} />
            )}

            {product.images.length > 0 ? (
              <Carousel images={product.images} />
            ) : (
              <Images className='svg-48 fc-gray-600' />
            )}
          </div>

          <div className='product__item-content'>
            <div className='item__title'>
              <h3>{product.title}</h3>

              <span
                role='button'
                tabIndex={0}
                aria-label={product.liked ? "Kedvelés visszavonása" : "Kedvelés"}
                aria-pressed={product.liked}
                onClick={handleLike}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleLike(e as unknown as MouseEvent<HTMLSpanElement>);
                  }
                }}
                className={`${product.liked ? "liked" : ""}`}>
                <Heart className='svg-18' />
                {product.likes >= 1000
                  ? `${Math.floor(product.likes / 1000)}k`
                  : product.likes}
              </span>

              <span
                role='button'
                tabIndex={0}
                aria-label={product.saved ? "Mentés visszavonása" : "Mentés"}
                aria-pressed={product.saved}
                onClick={handleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSave(e as unknown as MouseEvent<HTMLSpanElement>);
                  }
                }}
                className={`${product.saved ? "saved" : ""}`}>
                <Bookmark className='svg-18' />
                {product.saves >= 1000
                  ? `${Math.floor(product.saves / 1000)}k`
                  : product.saves}
              </span>
            </div>

            <div className='item__desc'>
              <p>{product.condition}</p>
            </div>

            <div className='item__size'>
              <span>{product.size || "Több méretben"}</span>
            </div>

            <div className='item__price'>
              {(() => {
                const { origLabel, discLabel } = buildListPriceLabels({
                  minPrice: product.minPrice ?? null,
                  price: product.price ?? null,
                  discountedMinPrice: product.discountedPrice ?? null, // ha a backend már adta
                  // Ha a listában nincs percent, hagyd null-on — a util a discountedPrice-t fogja előnyben részesíteni.
                  discountPercent: null,
                  hasMultipleSizes: product.itemsCount > 1,
                });

                return (
                  <>
                    {discLabel && <span className='discount'>{discLabel}</span>}
                    <span className='price__original'>{origLabel}</span>
                  </>
                );
              })()}
            </div>
          </div>
        </Link>
      </li>
    </>
  );
};

export default ProductListItem;
