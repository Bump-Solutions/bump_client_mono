import type { AddressModel } from "@bump/core/models";
import { useMounted } from "@bump/hooks";
import type { MouseEvent } from "react";
import { toast } from "sonner";
import { useDeleteAddress } from "../../../hooks/address/useDeleteAddress";

import Button from "../../../components/Button";
import StateButton from "../../../components/StateButton";

import { Trash } from "lucide-react";

type DeleteProps = {
  address: AddressModel;
  close: () => void;
};

const Delete = ({ address, close }: DeleteProps) => {
  const isMounted = useMounted();

  const deleteAddressMutation = useDeleteAddress(() => {
    setTimeout(() => {
      if (isMounted()) {
        close();
      }
    }, 500);
  });

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!address) return;

    const deletePromise = deleteAddressMutation.mutateAsync(address.id);

    toast.promise(deletePromise, {
      loading: "Cím törlése folyamatban...",
      success: `A(z) "${address.name}" cím törölve.`,
      error: (err) =>
        (err?.response?.data?.message as string) ||
        "Hiba a cím törlése közben.",
    });

    return deletePromise;
  };

  return (
    <>
      <h1 className='modal__title'>
        🗑️ Biztosan törölni szeretnéd a(z)&nbsp;
        <span className='fc-blue-500'>"{address.name}"</span>&nbsp;címet?
      </h1>
      <div className='modal__content'>
        <p>
          A cím törlése véglegesen eltávolítja azt a lakcímeid közül. Ez a
          művelet nem vonható vissza.
        </p>
      </div>
      <div className='modal__actions'>
        <Button
          className='secondary'
          text='Mégsem'
          disabled={deleteAddressMutation.isPending}
          onClick={() => close()}
        />
        <StateButton
          className='secondary red'
          text='Törlés'
          onClick={handleDelete}>
          <Trash />
        </StateButton>
      </div>
    </>
  );
};

export default Delete;
