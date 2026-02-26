import type { CartPackageModel } from "@bump/core/models";
import { useDeferredValue } from "react";
import { useCartSearch } from "../../hooks/cart/useSearchCart";

import Package from "./Package";

type PackageListProps = {
  searchKey: string;
};

const PackageList = ({ searchKey }: PackageListProps) => {
  const deferred = useDeferredValue(searchKey);
  const { filteredPackages, highlightIndex } = useCartSearch(deferred);

  return (
    <ul className='package__list'>
      {filteredPackages.map((pkg: CartPackageModel) => {
        const sid = pkg.seller.id;

        return <Package key={sid} pkg={pkg} highlightIndex={highlightIndex} />;
      })}
    </ul>
  );
};

export default PackageList;
