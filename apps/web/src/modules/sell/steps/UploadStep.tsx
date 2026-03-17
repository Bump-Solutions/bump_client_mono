import { clearErroredFields } from "@bump/forms";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { useStore } from "@tanstack/react-form";
import { useEffect, useMemo, type MouseEvent } from "react";
import type { SellFormApi } from "../../../hooks/sell/useSellForm";
import { SELL_FIELDS } from "../../../wizards/sell/fields";
import { SELL_STEPS, useSellStepper } from "../../../wizards/sell/stepper";

import Button from "../../../components/Button";
import StateButton from "../../../components/StateButton";
import SortableImage from "../parts/SortableImage";
import UploadDropzone from "../parts/UploadDropzone";

import { Tag } from "lucide-react";

type UploadStepProps = {
  form: SellFormApi;
  next: () => Promise<void>;
};

const UploadStep = ({ form, next }: UploadStepProps) => {
  const stepper = useSellStepper();

  const images = useStore(form.store, (state) => state.values.upload.images);

  const isBusy = useStore(
    form.store,
    (state) =>
      state.isValidating || state.isFormValidating || state.isFieldsValidating,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const previews = useMemo(() => {
    return images.map((image: File) => ({
      file: image,
      url: URL.createObjectURL(image),
    }));
  }, [images]);

  useEffect(() => {
    return () => {
      // Revoke the object URLs to avoid memory leaks
      previews.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img: File) => img.name === active.id);
    const newIndex = images.findIndex((img: File) => img.name === over.id);

    form.setFieldValue("upload.images", arrayMove(images, oldIndex, newIndex));
  };

  const removeImage = (name: string) => {
    form.setFieldValue(
      "upload.images",
      images.filter((img: File) => img.name !== name),
    );
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // SignupForm.next() already:
    // - touches fields for current step
    // - validates fields
    // - validates Zod section
    // - and calls form.handleSubmit() when last
    await next();
  };

  const prev = () => {
    clearErroredFields(form, SELL_FIELDS.items, { resetTouched: true });
    stepper.navigation.prev();
  };

  return (
    <>
      <div className='modal__content'>
        <div className='step step-4'>
          <div className='upload__wrapper'>
            <UploadDropzone form={form} />

            <div className='images__wrapper'>
              {images.length === 0 && (
                <p className='p-0 no-image'>
                  A kiválasztott képek itt jelennek meg.
                </p>
              )}

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={images.map((image) => image.name)}
                  strategy={rectSortingStrategy}>
                  <div className='images__grid'>
                    {previews.map(({ file, url }) => (
                      <SortableImage
                        key={file.name}
                        id={file.name}
                        url={url}
                        onRemove={() => removeImage(file.name)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </div>
      </div>

      <div className='modal__actions'>
        <span className='fs-16 fc-gray-600 truncate'>
          {stepper.state.current.index + 1} / {SELL_STEPS.length}
        </span>

        <div className='d-flex gap-2 a-center'>
          <Button
            type='button'
            text='Vissza'
            className='tertiary'
            onClick={prev}
          />

          <StateButton
            type='button'
            disabled={isBusy}
            text='Eladás'
            className='primary mt-0 mb-0'
            onClick={handleSubmit}>
            <Tag />
          </StateButton>
        </div>
      </div>
    </>
  );
};

export default UploadStep;
