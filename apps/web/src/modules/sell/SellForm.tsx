import { touchFields, validateFields, validateZodSection } from "@bump/forms";
import { toast } from "sonner";
import { useSellForm } from "../../hooks/sell/useSellForm";
import { SELL_FIELDS } from "../../wizards/sell/fields";
import { useSellStepper } from "../../wizards/sell/stepper";

import DetailsStep from "./steps/DetailsStep";
import ItemsStep from "./steps/ItemsStep";
import SelectStep from "./steps/SelectStep";
import UploadStep from "./steps/UploadStep";

const SellForm = () => {
  const form = useSellForm();

  const stepper = useSellStepper();
  const stepId = stepper.state.current.data.id;
  const stepData = stepper.state.current.data;

  const next = async (): Promise<void> => {
    const fields = SELL_FIELDS[stepId];
    touchFields(form, fields);
    await validateFields(form, fields, "submit");

    const basePath = stepData.basePath as
      | "select"
      | "details"
      | "items"
      | "upload";
    const schema = stepData.schema;
    const sectionValue = form.state.values[basePath];

    const result = validateZodSection(form, basePath, sectionValue, schema, {
      writeToMeta: true,
    });
    if (!result.ok) {
      toast.error("Kérjük javítsd a hibás mezőket!");
      throw new Error("Invalid form submission");
    }

    if (!stepper.state.isLast) {
      stepper.navigation.next();
    } else {
      form.handleSubmit();
    }
  };

  return (
    <>
      <h1 className='modal__title mb-0_5 fs-22'>{stepData.title}</h1>
      <p className='modal__description fc-gray-600 fs-16'>
        {stepData.description}
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}>
        {stepper.flow.switch({
          select: () => <SelectStep form={form} next={next} />,
          details: () => <DetailsStep form={form} next={next} />,
          items: () => <ItemsStep form={form} next={next} />,
          upload: () => <UploadStep form={form} next={next} />,
        })}
      </form>
    </>
  );
};

export default SellForm;
