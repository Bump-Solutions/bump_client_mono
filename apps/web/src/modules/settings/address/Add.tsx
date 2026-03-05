import type { AddressModel } from "@bump/core/models";
import { addressSchema, type AddressValues } from "@bump/core/schemas";
import { useMounted } from "@bump/hooks";
import type { NominatimReverseResponse } from "@bump/types";
import { CirclePlus } from "lucide-react";
import { useCallback, useRef, type MouseEvent } from "react";
import { toast } from "sonner";
import { useAppForm } from "../../../forms/hooks";
import { useAddAddress } from "../../../hooks/address/useAddAddress";
import { useGetCurrentLocation } from "../../../hooks/address/useGetCurrentLocation";

import Button from "../../../components/Button";
import Spinner from "../../../components/Spinner";
import StateButton from "../../../components/StateButton";
import FieldGroup from "../../../forms/FieldGroup";

type AddProps = {
  addresses: AddressModel[];
  close: () => void;
};

const defaultValues: AddressValues = {
  name: "",
  country: "",
  city: "",
  zip: "",
  street: "",
  default: false,
};

const Add = ({ addresses, close }: AddProps) => {
  const isMounted = useMounted();

  const appliedRef = useRef(false);

  const form = useAppForm({
    defaultValues,

    validators: {
      onSubmit: addressSchema,

      onSubmitAsync: async ({ value }) => {
        // Név egyediség
        const taken = addresses.some(
          (a) =>
            a.name.trim().toLowerCase() === value.name.trim().toLowerCase(),
        );

        if (taken) {
          return {
            fields: {
              name: "Ez a név már használatban van.",
            },
          };
        }

        return null;
      },
    },

    onSubmit: async ({ value, formApi }) => {
      const addPromise = addAddressMutation.mutateAsync(value);

      toast.promise(addPromise, {
        loading: "Cím hozzáadása folyamatban...",
        success: `A(z) "${value.name}" cím létrehozva.`,
        error: () => "Hiba a cím hozzáadása során.",
      });

      await addPromise;

      formApi.reset();
    },

    onSubmitInvalid: async () => {
      throw new Error("Invalid form submission");
    },
  });

  const addAddressMutation = useAddAddress(() => {
    setTimeout(() => {
      if (isMounted()) {
        close();
      }
    }, 500);
  });

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    await form.handleSubmit();
    if (!form.store.state.isValid) {
      toast.error("Kérjük javítsd a hibás mezőket!");
      throw new Error("Invalid form submission");
    }
  };

  const handleGeoSuccess = useCallback(
    (resp: NominatimReverseResponse) => {
      if (appliedRef.current) return;

      const { address } = resp;
      if (!address) return;

      appliedRef.current = true;

      form.setFieldValue("name", resp.name || "");
      form.setFieldValue("country", address.country || "");
      form.setFieldValue("city", address.city || "");
      form.setFieldValue("zip", address.postcode || "");
      form.setFieldValue("street", address.road || "");
    },
    [form],
  );

  const { loading } = useGetCurrentLocation(handleGeoSuccess);

  if (loading) {
    return (
      <div className='py-5'>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <h1 className='modal__title'>🏠 Új lakcím hozzáadása</h1>

      <div className='modal__content'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}>
          <form.AppField
            name='name'
            validators={{
              onChange: addressSchema.shape.name,
              onBlur: ({ value }) => {
                const taken = addresses.some(
                  (a) =>
                    a.name.trim().toLowerCase() === value.trim().toLowerCase(),
                );

                return taken ? "Ez a név már használatban van." : undefined;
              },
            }}>
            {(field) => (
              <field.Input
                type='text'
                label='Név'
                required
                placeholder='pl. Otthoni cím'
                autoFocus
                tabIndex={1}
              />
            )}
          </form.AppField>

          <form.AppField
            name='country'
            validators={{ onChange: addressSchema.shape.country }}>
            {(field) => (
              <field.Input
                type='text'
                label='Ország'
                required
                placeholder='pl. Magyarország'
                tabIndex={2}
              />
            )}
          </form.AppField>

          <FieldGroup columns={2}>
            <form.AppField
              name='city'
              validators={{ onChange: addressSchema.shape.city }}>
              {(field) => (
                <field.Input
                  type='text'
                  label='Város'
                  required
                  placeholder='pl. Budapest'
                  tabIndex={3}
                />
              )}
            </form.AppField>

            <form.AppField
              name='zip'
              validators={{ onChange: addressSchema.shape.zip }}>
              {(field) => (
                <field.Input
                  type='text'
                  label='Irányítószám'
                  required
                  placeholder='pl. 1111'
                  tabIndex={4}
                />
              )}
            </form.AppField>
          </FieldGroup>

          <form.AppField
            name='street'
            validators={{ onChange: addressSchema.shape.street }}>
            {(field) => (
              <field.Input
                type='text'
                label='Utca, házszám'
                placeholder='pl. Kossuth Lajos utca 1.'
                tabIndex={5}
              />
            )}
          </form.AppField>

          <form.AppField
            name='default'
            validators={{ onChange: addressSchema.shape.default }}>
            {(field) => (
              <field.ToggleButton
                text='Alapértelmezett cím'
                tabIndex={6}
                className='mt-1'
              />
            )}
          </form.AppField>
        </form>
      </div>

      <div className='modal__actions'>
        <Button
          className='secondary'
          text='Mégsem'
          disabled={addAddressMutation.isPending}
          onClick={() => close()}
          tabIndex={7}
        />
        <StateButton
          type='submit'
          className='primary'
          text='Hozzáadás'
          onClick={handleSubmit}
          tabIndex={8}>
          <CirclePlus />
        </StateButton>
      </div>
    </>
  );
};

export default Add;
