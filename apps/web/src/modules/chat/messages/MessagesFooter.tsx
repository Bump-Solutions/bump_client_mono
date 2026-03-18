import type { MessageType, MessageTypeOptions } from "@bump/core/models";
import type { FileUpload } from "@bump/types";
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useClickAway, useToggle } from "react-use";
import { toast } from "sonner";
import { useUploadChatImages } from "../../../hooks/chat/useUploadChatImages";

import Button from "../../../components/Button";
import ImageUpload from "./ImageUpload";
import MessagesFooterImages from "./MessagesFooterImages";

import { ArrowUp, CircleAlert } from "lucide-react";

type SendMessagePayload = {
  message: string;
  attachment: string; // ";;"-joined URLs (your backend format)
  type: 0 | 1 | 2;
};

type MessagesFooterProps = {
  chat: string;
  onSend: (data: SendMessagePayload) => void;
};

const MAX_MSG_LENGTH = 4000; // Define the maximum length for the message

const getMessageType = ({
  hasText,
  hasImages,
}: MessageTypeOptions): MessageType => {
  if (hasText && hasImages) return 2;
  if (hasImages) return 1;
  return 0;
};

const MessagesFooter = ({ chat, onSend }: MessagesFooterProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [message, setMessage] = useState("");
  const [images, setImages] = useState<FileUpload[]>([]);
  const [isFocused, toggleFocus] = useToggle(false);
  const [isSending, setIsSending] = useState(false);

  useClickAway(wrapperRef, () => toggleFocus(false));

  const adjustHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, []);

  useLayoutEffect(() => {
    adjustHeight();
  }, [adjustHeight, message, images.length]);

  const remainingChars = MAX_MSG_LENGTH - message.length;
  const showCounter = remainingChars <= 50;
  const isOverLimit = remainingChars < 0;

  const disabled = useMemo(() => {
    const hasText = message.trim().length > 0;
    const hasImages = images.length > 0;
    return (!hasText && !hasImages) || isOverLimit || isSending;
  }, [message, images.length, isOverLimit, isSending]);

  const uploadChatImagesMutation = useUploadChatImages();

  const handleSend = useCallback(async () => {
    if (isSending) return;

    const text = message.trim();
    const hasText = text.length > 0;
    const hasImages = images.length > 0;

    if (!hasText && !hasImages) return;
    if (isOverLimit) return;

    setIsSending(true);
    try {
      let attachment = "";

      if (hasImages) {
        const { images: data } = await uploadChatImagesMutation.mutateAsync({
          chat,
          images,
        });

        attachment = data.map((img) => img.image_url).join(";;");
      }

      const type = getMessageType({ hasText, hasImages });

      onSend({
        message: text,
        attachment,
        type,
      });

      // reset local state
      setMessage("");
      setImages([]);

      const ta = textareaRef.current;
      if (ta) ta.style.height = "auto";
    } catch {
      toast.error("Hiba történt a képek feltöltése során.");
    } finally {
      setIsSending(false);
    }
  }, [
    chat,
    images,
    isOverLimit,
    isSending,
    message,
    onSend,
    uploadChatImagesMutation,
  ]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void handleSend();
      }
    },
    [handleSend],
  );

  return (
    <footer className='messages__footer'>
      <div
        ref={wrapperRef}
        className={`chat__message__input__wrapper ${isFocused ? "focused" : ""}`}
        onClick={() => toggleFocus(true)}>
        <div className='chat__message__input'>
          <textarea
            ref={textareaRef}
            placeholder='Írj üzenetet...'
            onFocus={() => toggleFocus(true)}
            onInput={adjustHeight}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            tabIndex={0}
          />
        </div>

        {showCounter && (
          <div className={`max-length${isOverLimit ? " over-limit" : ""}`}>
            <div>
              {isOverLimit && (
                <>
                  <CircleAlert className='svg-20' />
                  Maximális karakterszám
                </>
              )}
            </div>
            <div className='fw-700'>
              {message.length} / {MAX_MSG_LENGTH}
            </div>
          </div>
        )}

        {images.length > 0 && (
          <MessagesFooterImages images={images} setImages={setImages} />
        )}

        <div className='chat__message__actions'>
          <ImageUpload setImages={setImages} />

          <div className='btn__send'>
            <Button
              className='primary'
              onClick={handleSend}
              disabled={disabled}
              loading={isSending}>
              <ArrowUp />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MessagesFooter;
