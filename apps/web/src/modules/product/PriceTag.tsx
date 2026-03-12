import {
  clampDiscount,
  computeDiscounted,
  formatMinorHU,
  fromSuffix,
} from "@bump/utils";
import { useMemo } from "react";
import { Link } from "react-router";
import type { FacetProps } from "../../hooks/product/useFacetedSearch";
import { ROUTES } from "../../routes/routes";

import { Info } from "lucide-react";

interface PriceTagProps extends FacetProps {
  discount: number | null | undefined;
}

const PriceTag = ({
  quantity,
  discount,
  available,
  filtered,
}: PriceTagProps) => {
  const hasActiveFilter = filtered !== null;
  const sourceItems = hasActiveFilter ? filtered : available;

  // 1) Nyers árak minor units-ben (HUF integer), rendezve növekvőbe
  const rawPrices = useMemo(
    () =>
      sourceItems ? sourceItems.map((i) => i.price).sort((a, b) => a - b) : [],
    [sourceItems],
  );

  // 2) Kedvezmény clampelve (1..100) és effektív árak ugyanazzal a formulával,
  //    mint a CartProvider-ben → teljes konzisztencia (DRY).
  const d = clampDiscount(discount ?? undefined);
  const discPrices = useMemo(
    () => rawPrices.map((p) => computeDiscounted(p, d)),
    [rawPrices, d],
  );

  // 3) Összegezzük az első N elemet (vagy csak az elsőt, ha quantity<=1)
  const count = Math.min(quantity, rawPrices.length);
  const origVal = useMemo(
    () => rawPrices.slice(0, count).reduce((s, p) => s + p, 0),
    [rawPrices, count],
  );
  const discVal = useMemo(
    () => discPrices.slice(0, count).reduce((s, p) => s + p, 0),
    [discPrices, count],
  );

  if (!sourceItems || sourceItems.length === 0 || rawPrices.length === 0) {
    return null;
  }

  // 4) egységes suffix döntés utilból
  //    - ha pontosan 1 elem van, mindig " Ft"
  //    - ha több elem, és nincs szűrés, akkor " Ft-tól"
  //    - különben " Ft"
  const suffix = fromSuffix(
    quantity <= 1 && sourceItems.length > 1 && !hasActiveFilter,
  );

  const origTitle = `${formatMinorHU(origVal)}${suffix}`;
  const discTitle = `${formatMinorHU(discVal)}${suffix}`;

  return (
    <div className='product__price-tag'>
      <h3>
        {d ? (
          <>
            <span className='discount'>{discTitle}</span>
            <span className='price__original'>{origTitle}</span>
          </>
        ) : (
          <span>{origTitle}</span>
        )}
      </h3>

      <div className='product__price__infobox'>
        <p>
          Az itt feltüntetett ár <b className='fc-gray-900'>tájékoztató</b>{" "}
          jellegű. A pontos végleges összegről érdeklődj az eladónál. <br />A
          tételek ára a termék állapotától, méretétől és egyéb jellemzőitől
          függően eltérhet.
        </p>
        <Link to={ROUTES.HOME} className='link black no-anim'>
          <Info /> Részletek
        </Link>
      </div>
    </div>
  );
};

export default PriceTag;
