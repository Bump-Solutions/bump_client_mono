import type { CartPackageModel } from "@bump/core/models";
import { useMemo } from "react";
import { PackageContext } from "../../context/cart/context";
import type { HighlightIndex } from "../../utils/highlight";

import PackageHeader from "./PackageHeader";
import PackageSummary from "./PackageSummary";

type PackageProps = {
  pkg: CartPackageModel;
  highlightIndex?: HighlightIndex;
};

const Package = ({ pkg, highlightIndex }: PackageProps) => {
  const contextValue = useMemo(
    () => ({ pkg, highlightIndex }),
    [pkg, highlightIndex],
  );

  return (
    <PackageContext.Provider value={contextValue}>
      <li className='package__wrapper'>
        <div className='package'>
          <PackageHeader />
        </div>

        <PackageSummary />
      </li>
    </PackageContext.Provider>
  );
};

export default Package;
