import type { SellFormApi } from "../../../hooks/sell/useSellForm";
import { sellUploadStepSchema } from "../../../schemas/sellWizard";

type UploadDropzoneProps = {
  form: SellFormApi;
};

const MAX_FILES = 10;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const UploadDropzone = ({ form }: UploadDropzoneProps) => {
  return (
    <div className='dropzone__wrapper'>
      <form.AppField
        name='upload.images'
        validators={{ onChange: sellUploadStepSchema.shape.images }}>
        {(field) => (
          <field.Dropzone
            accept={{ "image/*": [".png", ".jpg", ".jpeg"] }}
            multiple
            maxFiles={MAX_FILES}
            maxSize={MAX_SIZE}
          />
        )}
      </form.AppField>
    </div>
  );
};

export default UploadDropzone;
