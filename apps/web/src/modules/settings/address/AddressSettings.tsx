import type { AddressModel } from "@bump/core/models";
import { useEffect, useReducer } from "react";
import { toast } from "sonner";
import { usePersonalSettings } from "../../../context/settings/usePersonalSettings";
import { useListAddresses } from "../../../hooks/address/useListAddresses";
import { ROUTES } from "../../../routes/routes";

import Add from "./Add";
import Delete from "./Delete";
import Modify from "./Modify";

import Back from "../../../components/Back";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Spinner from "../../../components/Spinner";

import { Check, CirclePlus, Pencil, Trash } from "lucide-react";

const ACTIONS = {
  OPEN: "open",
  CLOSE: "close",
} as const;

const CONTENTS = {
  ADD: "add",
  MODIFY: "modify",
  DELETE: "delete",
} as const;
type ContentType = (typeof CONTENTS)[keyof typeof CONTENTS];

interface AddressFormState {
  isOpen: boolean;
  content: ContentType | null;
  address: AddressModel | null;
}

type AddressFormAction =
  | { type: typeof ACTIONS.OPEN; content: ContentType; address?: AddressModel }
  | { type: typeof ACTIONS.CLOSE };

const reducer = (
  state: AddressFormState,
  action: AddressFormAction,
): AddressFormState => {
  switch (action.type) {
    case ACTIONS.OPEN:
      return {
        ...state,
        isOpen: true,
        content: action.content,
        address: action.address ?? null,
      };

    case ACTIONS.CLOSE:
      return {
        ...state,
        isOpen: false,
        content: null,
        address: null,
      };

    default:
      return state;
  }
};

const AddressSettings = () => {
  const INITIAL_STATE: AddressFormState = {
    isOpen: false,
    content: null,
    address: null,
  };

  const { setData } = usePersonalSettings();

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const { data: addresses = [], isLoading, isError } = useListAddresses();

  useEffect(() => {
    if (isError) toast.error("Hiba a címek betöltése közben.");
  }, [isError]);

  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.find((address) => address.default);
      if (defaultAddress) {
        setData({
          address: {
            id: defaultAddress.id,
            name: defaultAddress.name,
            country: defaultAddress.country,
            city: defaultAddress.city,
            zip: defaultAddress.zip,
            street: defaultAddress.street,
            default: defaultAddress.default,
          },
        });
      }
    }
  }, [addresses, setData]);

  const openForm = (content: ContentType, address?: AddressModel) => {
    dispatch({ type: ACTIONS.OPEN, content, address });
  };

  const closeForm = () => {
    dispatch({ type: ACTIONS.CLOSE });
  };

  return (
    <>
      <Modal isOpen={state.isOpen} close={closeForm}>
        {state.content === CONTENTS.ADD && (
          <Add addresses={addresses} close={closeForm} />
        )}

        {state.content === CONTENTS.MODIFY && state.address && (
          <Modify
            address={state.address}
            addresses={addresses}
            close={closeForm}
          />
        )}

        {state.content === CONTENTS.DELETE && state.address && (
          <Delete address={state.address} close={closeForm} />
        )}
      </Modal>

      <div className='page__wrapper'>
        <div className='form-box'>
          <Back to={ROUTES.SETTINGS.ROOT} className='link hide-mobile' />

          <h1 className='page__title'>Címek kezelése</h1>
          <p className='page__desc mb-2'>
            Itt kezelheted a címeidet és adhatsz hozzá újakat.
          </p>

          {isLoading ? (
            <div className='relative py-3 w-full'>
              <Spinner />
            </div>
          ) : (
            <div className='address__wrapper'>
              <div className='address-box'>
                <article className='add' onClick={() => openForm(CONTENTS.ADD)}>
                  <CirclePlus />
                  <h4>Új cím hozzáadása</h4>
                </article>
              </div>

              {addresses
                .sort((_, b) => (b.default ? 1 : -1))
                .map((address: AddressModel, index: number) => {
                  return (
                    <article key={index} className='address'>
                      <Button
                        className='secondary delete'
                        onClick={() => openForm(CONTENTS.DELETE, address)}>
                        <Trash />
                      </Button>

                      <h5>Lakcím</h5>
                      <h4 className='truncate'>{address.name}</h4>
                      <div>
                        <p className='truncate'>{address.street}</p>
                        <p className='truncate'>{address.zip}</p>
                        <p className='truncate'>{address.city}</p>
                        <p className='truncate'>{address.country}</p>
                      </div>

                      {address.default && (
                        <span className='address--default'>
                          <Check strokeWidth={3} className='svg-18' />
                          Alapértelmezett cím
                        </span>
                      )}

                      <Button
                        className='primary'
                        text='Szerkesztés'
                        onClick={() => openForm(CONTENTS.MODIFY, address)}>
                        <Pencil />
                      </Button>
                    </article>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddressSettings;
