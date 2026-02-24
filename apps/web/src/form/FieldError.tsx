type FieldErrorProps = {
  id: string;
  showAll?: boolean;
  errors: unknown[];
};

type MessageLike = { message?: unknown; error?: unknown };

function isMessageLike(v: unknown): v is MessageLike {
  return typeof v === "object" && v !== null;
}

const toMessages = (errors?: unknown[]): string[] => {
  if (!errors?.length) return [];

  return errors.flatMap((e) => {
    if (!e) return [];
    if (typeof e === "string") return e.trim() ? [e] : [];

    if (isMessageLike(e)) {
      const msg = e.message;
      if (typeof msg === "string" && msg.trim()) return [msg];

      const alt = e.error;
      if (typeof alt === "string" && alt.trim()) return [alt];
    }

    return [];
  });
};

const FieldError = ({ id, errors, showAll = false }: FieldErrorProps) => {
  const msgs = toMessages(errors);
  if (msgs.length === 0) return null;

  const list = showAll ? msgs : [msgs[0]];

  return (
    <em id={id} className='field__error' role='alert' aria-live='polite'>
      {list.join(" ")}
    </em>
  );
};

export default FieldError;
