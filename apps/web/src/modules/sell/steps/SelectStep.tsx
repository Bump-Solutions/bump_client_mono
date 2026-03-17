import { useStore } from "@tanstack/react-form";
import type { SellFormApi } from "../../../hooks/sell/useSellForm";
import { SELL_STEPS, useSellStepper } from "../../../wizards/sell/stepper";

import Button from "../../../components/Button";

import { FileEdit, MoveRight, PackageSearch } from "lucide-react";

type SelectStepProps = {
  form: SellFormApi;
  next: () => Promise<void>;
};

const SelectStep = ({ form, next }: SelectStepProps) => {
  const stepper = useSellStepper();

  const isBusy = useStore(
    form.store,
    (state) =>
      state.isValidating || state.isFormValidating || state.isFieldsValidating,
  );

  // választott opció
  const isCatalog = useStore(
    form.store,
    (state) => state.values.select.isCatalog,
  );

  const handleSelect = (value: boolean) => {
    if (value === isCatalog) return;

    // 1) beállítjuk az isCatalog-ot
    form.setFieldValue("select.isCatalog", value);

    // 2) a details.product-ot mindig “tiszta” állapotba hozzuk
    form.setFieldValue("details.product", {
      id: null,
      brand: "",
      model: "",
      colorWay: "",
    });
  };

  return (
    <>
      <div className='modal__content'>
        <div className='step step-1'>
          <div className='options__wrapper'>
            {/* Katalógus opció */}
            <article
              role='button'
              tabIndex={0}
              aria-pressed={isCatalog}
              className={`option ${isCatalog ? "selected" : ""}`}
              onClick={() => handleSelect(true)}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && handleSelect(true)
              }>
              <div className='option__col--radio'>
                <div />
              </div>
              <div className='option__col--text'>
                <h5 className='fw-700 fs-14'>AJÁNLOTT</h5>
                <h3 className='fs-18 mt-0_25'>Katalógusból választok</h3>
                <p className='fs-14 fc-gray-700 mt-0_75'>
                  Keresd meg a terméked márka, modell és színállás szerint, és
                  töltsd fel gyorsan és könnyedén.
                </p>
              </div>
              <div className='option__col--img'>
                <PackageSearch className='svg-64 fc-gray-600' />
              </div>
            </article>

            {/* Saját adatok opció */}
            <article
              role='button'
              tabIndex={0}
              aria-pressed={!isCatalog}
              className={`option ${!isCatalog ? "selected" : ""}`}
              onClick={() => handleSelect(false)}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && handleSelect(false)
              }>
              <div className='option__col--radio'>
                <div />
              </div>
              <div className='option__col--text'>
                <h3>Saját adatokat adok meg</h3>
                <p className='fs-14 fc-gray-700 mt-0_5'>
                  Te adod meg a termék adatait, amit később ellenőrzünk.
                  <br />⏳ A termék az{" "}
                  <b className='fc-gray-900'>ellenőrzésig</b> nem jelenik meg a
                  profilon!
                </p>
              </div>
              <div className='option__col--img'>
                <FileEdit className='svg-64 fc-gray-600' />
              </div>
            </article>
          </div>
        </div>
      </div>

      <div className='modal__actions'>
        <span className='fs-16 fc-gray-600 truncate'>
          {stepper.state.current.index + 1} / {SELL_STEPS.length}
        </span>

        <div className='d-flex gap-2 a-center'>
          {/* Első lépés: nincs “Vissza” */}
          <Button
            type='button'
            disabled={isBusy}
            onClick={() => void next()}
            text='Folytatás'
            className='tertiary icon--reverse'>
            <MoveRight />
          </Button>
        </div>
      </div>
    </>
  );
};

export default SelectStep;
