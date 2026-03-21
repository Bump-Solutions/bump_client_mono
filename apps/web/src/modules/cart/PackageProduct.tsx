import type { CartItemModel, CartProductModel } from "@bump/core/models";
import { CURRENCY_LABELS, ENUM, formatMinorHU } from "@bump/utils";
import { Link } from "react-router";
import Button from "../../components/Button";
import Image from "../../components/Image";
import { ROUTES } from "../../routes/routes";

type PackageProductProps = {
  product: CartProductModel;
};

const findLabel = (
  options: { value: number; label: string }[],
  value: number,
) => options.find((opt) => opt.value === value)?.label || "-";

const PackageProduct = ({ product }: PackageProductProps) => {
  const { grossSubtotal, discountsTotal, indicativeSubtotal } = product.summary;

  const hasDiscount =
    discountsTotal.amount > 0 &&
    indicativeSubtotal.amount < grossSubtotal.amount;

  const discountPercent =
    hasDiscount && grossSubtotal.amount > 0
      ? Math.round((discountsTotal.amount / grossSubtotal.amount) * 100)
      : 0;

  const groupedItems = product.items.reduce(
    (acc, item) => {
      const key = `${item.gender}-${item.size}-${item.condition}-${item.price.amount}-${item.price.currency}`;

      if (acc[key]) {
        acc[key].count += 1;
      } else {
        acc[key] = {
          key,
          ...item,
          count: 1,
        };
      }

      return acc;
    },
    {} as Record<string, CartItemModel & { key: string; count: number }>,
  );

  return (
    <li className='package__product'>
      <div className='product__image'>
        <Link to={ROUTES.PRODUCT(product.id).ROOT} target='_blank'>
          <Image src={product.image} alt={product.title} />
        </Link>
      </div>

      <div className='product__wrapper'>
        <div className='product__content'>
          <div className='product__details'>
            <h5>
              <Link to={ROUTES.PRODUCT(product.id).ROOT} target='_blank'>
                {product.title}
              </Link>
            </h5>

            <div className='product__badges'>
              <span className='badge' title='Márka'>
                {product.product.brand}
              </span>
              <span className='badge' title='Model'>
                {product.product.model}
              </span>
              <span className='badge' title='Színállás'>
                {product.product.colorWay}
              </span>

              {product.product.colors.split(";").map((color) => (
                <span className='badge color'>
                  <span style={{ background: color }} />
                </span>
              ))}
            </div>

            <table>
              <tbody>
                {Object.values(groupedItems).map((item) => (
                  <tr key={item.key}>
                    <td>
                      {findLabel(ENUM.PRODUCT.GENDER_OPTIONS, item.gender)}
                    </td>
                    <td>
                      {findLabel(ENUM.PRODUCT.SIZE_OPTIONS, Number(item.size))}
                    </td>
                    <td>
                      {findLabel(
                        ENUM.PRODUCT.CONDITION_OPTIONS,
                        item.condition,
                      )}
                    </td>
                    <td className='ta-right'>{item.count} db</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className='product__actions'>
              <Button className='secondary sm nomargin'>Módosítás</Button>
              <Button className='secondary sm nomargin'>Törlés</Button>
            </div>
          </div>

          <div className='product__price'>
            {hasDiscount ? (
              <>
                <span className='badge discount'>-{discountPercent}%</span>

                <span className='discounted'>
                  {formatMinorHU(indicativeSubtotal.amount)}{" "}
                  {CURRENCY_LABELS[indicativeSubtotal.currency]}
                </span>

                <span className='muted'>
                  {formatMinorHU(grossSubtotal.amount)}{" "}
                  {CURRENCY_LABELS[grossSubtotal.currency]}
                </span>
              </>
            ) : (
              <span>
                {formatMinorHU(grossSubtotal.amount)}{" "}
                {CURRENCY_LABELS[grossSubtotal.currency]}
              </span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default PackageProduct;
