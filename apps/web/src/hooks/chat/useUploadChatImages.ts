import type { ApiError } from "@bump/core/api";
import { uploadChatImages } from "@bump/core/services";
import type { FileUpload } from "@bump/types";
import { useMutation } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

type UploadChatImagesVariables = {
  chat: string;
  images: FileUpload[];
};

export const useUploadChatImages = (
  onSuccess?: (
    resp: { images: { id: number; image_url: string }[] },
    variables: UploadChatImagesVariables,
  ) => void,
  onError?: (error: ApiError, variables: UploadChatImagesVariables) => void,
) => {
  const http = useAuthHttpClient();

  return useMutation<
    { images: { id: number; image_url: string }[] },
    ApiError,
    UploadChatImagesVariables
  >({
    mutationFn: (data: UploadChatImagesVariables) =>
      uploadChatImages(http, data.chat, data.images),

    onSuccess: (resp, variables) => {
      if (onSuccess) {
        onSuccess(resp, variables);
      }
    },
    onError: (error, variables) => {
      if (onError) {
        onError(error, variables);
      }
      return Promise.reject(error);
    },
  });
};
