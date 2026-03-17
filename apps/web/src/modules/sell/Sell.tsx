import "../../styles/css/sell.css";

import { ENUM } from "@bump/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router";
import { useTitle } from "react-use";

import Button from "../../components/Button";
import Drawer from "../../components/Drawer";
import SellForm from "./SellForm";

import { X } from "lucide-react";
import { SellScoped } from "../../wizards/sell/stepper";

const Sell = () => {
  useTitle(`Eladás - ${ENUM.BRAND.NAME}`);

  const navigate = useNavigate();
  const isMobile = useMediaQuery({
    query: `(max-width: ${ENUM.MEDIA_MOBILE}px)`,
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <AnimatePresence mode='wait'>
      <SellScoped initialStep='select'>
        {isMobile ? (
          <Drawer className='sell' close={() => navigate(-1)}>
            <SellForm />
          </Drawer>
        ) : (
          <motion.section
            className='modal__wrapper'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}>
            <motion.div className='modal sell'>
              <Button
                className={`secondary close`}
                onClick={() => navigate(-1)}>
                <X />
              </Button>

              <SellForm />
            </motion.div>
          </motion.section>
        )}
      </SellScoped>
    </AnimatePresence>
  );
};

export default Sell;
