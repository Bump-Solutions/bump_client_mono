import type { CartPackageModel } from "@bump/core/models";
import { useMemo } from "react";
import { PackageContext } from "../../context/cart/context";
import type { HighlightIndex } from "../../utils/highlight";

import PackageContent from "./PackageContent";
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
    <PackageContext value={contextValue}>
      <section className='package__wrapper'>
        <div className='package'>
          <PackageHeader />

          <PackageContent />
        </div>

        <PackageSummary />
      </section>
    </PackageContext>
  );
};

export default Package;
