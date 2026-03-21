import { motion } from "framer-motion";
import { useRef, type MouseEvent } from "react";

import { useClickAway } from "react-use";

type PackageContextMenuProps = {
  toggleContextMenu: (value?: boolean) => void;
};

const PackageContextMenu = ({ toggleContextMenu }: PackageContextMenuProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useClickAway(ref, () => {
    toggleContextMenu(false);
  });

  const handleRemovePackage = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    // TODO
  };

  return (
    <motion.div
      ref={ref}
      className='package__menu-actions'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}>
      {/*
        <ul className='action-list'>
          <li className='action-list-item'>
            <div>
              <span>Módosítás</span>
            </div>
          </li>
        </ul>
      */}

      <ul className='action-list'>
        <li className='action-list-item red '>
          <div onClick={handleRemovePackage}>
            <span>Csomag törlése</span>
          </div>
        </li>
      </ul>
    </motion.div>
  );
};

export default PackageContextMenu;
