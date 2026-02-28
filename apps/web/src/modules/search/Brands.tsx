import { brandLogos } from "@bump/assets";
import { getRandomSubset } from "@bump/utils";
import { type Dispatch, type SetStateAction, useMemo } from "react";

type Brand = {
  key: keyof typeof brandLogos;
  label: string;
};

const BRANDS: Brand[] = [
  { key: "adidas", label: "Adidas" },
  { key: "asics", label: "Asics" },
  { key: "nike", label: "Nike" },
  { key: "airJordan", label: "Air Jordan" },
  { key: "newBalance", label: "New Balance" },
  { key: "puma", label: "Puma" },
  { key: "converse", label: "Converse" },
  { key: "yeezy", label: "Yeezy" },
  { key: "fearOfGod", label: "Fear Of God" },
  { key: "stussy", label: "Stüssy" },
  { key: "vans", label: "Vans" },
  { key: "reebok", label: "Reebok" },
];

interface BrandProps {
  setSearchKey: Dispatch<SetStateAction<string>>;
}

const Brands = ({ setSearchKey }: BrandProps) => {
  const brands = useMemo<Brand[]>(() => getRandomSubset(BRANDS, 8), []);

  return (
    <section className='search__brands'>
      <h3>Népszerű márkák</h3>
      <div className='brands'>
        {brands.map((brand) => {
          const src = brandLogos[brand.key][0];
          if (!src) return null;

          return (
            <div
              key={brand.key}
              className='brand'
              onClick={() => setSearchKey(brand.label)}>
              <div>
                <img src={src} alt={brand.label} loading='lazy' />
                <span className='truncate'>{brand.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Brands;
