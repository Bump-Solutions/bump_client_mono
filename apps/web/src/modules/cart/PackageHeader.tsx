import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Link } from "react-router";
import { useToggle } from "react-use";
import { usePackage } from "../../context/cart/usePackage";
import { ROUTES } from "../../routes/routes";
import { highlightTextParts } from "../../utils/highlight";

import Image from "../../components/Image";
import PackageContextMenu from "./PackageContextMenu";

import { EllipsisVertical, Star } from "lucide-react";

const PackageHeader = () => {
  const { pkg, highlightIndex } = usePackage();

  const [isContextMenuOpen, toggleContextMenu] = useToggle(false);

  const seller = pkg.seller;
  const ranges = highlightIndex?.perSeller?.[seller.id]?.sellerUsername ?? [];

  useEffect(() => {
    document.body.style.overflow = isContextMenuOpen ? "hidden" : "auto";
    document.body.style.pointerEvents = isContextMenuOpen ? "none" : "auto";

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.pointerEvents = "auto";
    };
  }, [isContextMenuOpen]);

  return (
    <header className='package__header'>
      <div className='seller-info'>
        <Link to={ROUTES.PROFILE(seller.username).ROOT} target='_blank'>
          <Image src={seller.profilePicture || ""} alt={seller.username} />
        </Link>
        <h4>
          <Link
            to={ROUTES.PROFILE(seller.username).ROOT}
            target='_blank'
            className='link black fw-700'>
            {highlightTextParts(seller.username, ranges)}
          </Link>
        </h4>

        <div className='rating'>
          <Link to={ROUTES.PROFILE(seller.username).ROOT} target='_blank'>
            <span>
              <Star />
            </span>
            <span>4.6</span>
            <span className='muted'>(123)</span>
          </Link>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleContextMenu(true);
        }}>
        <EllipsisVertical strokeWidth={3} />
      </button>

      {isContextMenuOpen && (
        <AnimatePresence mode='wait'>
          <PackageContextMenu toggleContextMenu={toggleContextMenu} />
        </AnimatePresence>
      )}
    </header>
  );
};

export default PackageHeader;
