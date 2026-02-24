import type { Accept, FileRejection } from "react-dropzone";
import FormBase, { type FormControlProps } from "./FormBase";
import { useFieldContext } from "./hooks";

import Dropzone from "../components/Dropzone";

type FormDropzoneProps = FormControlProps & {
  accept?: Accept;
  multiple?: boolean;
  maxFiles: number;
  maxSize?: number;
};

const FormDropzone = ({
  accept,
  multiple,
  maxFiles,
  maxSize,
  ...base
}: FormDropzoneProps) => {
  const field = useFieldContext<File | File[] | null>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const onDrop = (accepted: File[]) => {
    if (!accepted.length) return;

    let next: File | File[];

    if (multiple) {
      next = accepted.slice(0, maxFiles);
    } else {
      next = accepted[0];
    }

    field.setValue(next);
    field.setMeta((meta) => ({
      ...meta,
      errors: [],
      errorMap: {},
    }));
    field.handleBlur();
  };

  const onDropRejected = (rejections: FileRejection[]) => {
    const code = rejections[0]?.errors[0]?.code;

    let message = "";

    switch (code) {
      case "file-too-large":
        message =
          "A fájl mérete túl nagy." +
          (maxSize
            ? ` A megengedett méret ${Math.round(maxSize / (1024 * 1024))} MB.`
            : "");
        break;
      case "file-invalid-type":
        message = `Hibás fájl formátum. Megengedett: ${Object.values(
          accept || {},
        )
          .flat()
          .join(", ")}`;
        break;
      case "too-many-files":
        message = `Túl sok fájl. Maximum ${maxFiles} fájl tölthető fel egyszerre.`;
        break;
      default:
        message = "Hiba történt a fájl(ok) feltöltése során.";
        break;
    }

    field.setValue(multiple ? [] : null);
    field.setMeta((meta) => ({
      ...meta,
      errors: [message],
      errorMap: { onChange: message },
      isTouched: true,
    }));
    field.handleBlur();
  };

  return (
    <FormBase {...base}>
      <Dropzone
        onDrop={onDrop}
        onDropRejected={onDropRejected}
        accept={accept}
        multiple={multiple}
        maxFiles={maxFiles}
        maxSize={maxSize}
        isInvalid={isInvalid}
      />
    </FormBase>
  );
};

export default FormDropzone;
