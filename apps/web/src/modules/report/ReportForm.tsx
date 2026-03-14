import { reportSchema, type ReportInput } from "@bump/core/schemas";
import { useMounted } from "@bump/hooks";
import type { ReportType } from "@bump/types";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAppForm } from "../../forms/hooks";
import { useReport } from "../../hooks/report/useReport";

import Button from "../../components/Button";
import StateButton from "../../components/StateButton";

import { Flag } from "lucide-react";

type ReportFormProps = {
  id: string | undefined;
  type: ReportType;
};

const TITLES: Record<ReportType, string> = {
  product: "Termék jelentése",
  user: "Felhasználó jelentése",
};

const DESCRIPTIONS: Record<ReportType, string> = {
  product:
    "Törekszünk arra, hogy a termékinformációk pontosak és hitelesek legyenek. Ha ez a termék hamis, félrevezető vagy nem a valóságnak megfelelő, kérjük, jelentsd nekünk. A bejelentéseket bizalmasan vizsgáljuk ki.",
  user: "Fontos számunkra, hogy a sneaker közösség biztonságos és tisztességes maradjon. Ha ez a felhasználó megtévesztő adatokat ad meg, hamis terméket kínál vagy tisztességtelenül kereskedik, kérjük, jelentsd. Minden esetet bizalmasan kezelünk és kivizsgálunk.",
};

const LABELS: Record<ReportType, string> = {
  product: "termék",
  user: "felhasználó",
};

const LABELS_ACCUSATIVE: Record<ReportType, string> = {
  product: "terméket",
  user: "felhasználót",
};

type ReasonOption = {
  value: number;
  label: string;
  description?: string;
};

const REASON_OPTIONS: Record<ReportType, ReasonOption[]> = {
  product: [
    {
      value: 0,
      label: "Hamis termék",
      description:
        "Nem eredeti, márkajelzés vagy csomagolás alapján hamisítvány gyanús.",
    },
    {
      value: 1,
      label: "Csalás",
      description:
        "A hirdetés gyanús vagy félrevezető, az eladó viselkedése nem tűnik megbízhatónak.",
    },
    {
      value: 2,
      label: "Tiltott tartalom",
      description: "A termék nem felel meg a platform szabályainak.",
    },
    {
      value: 3,
      label: "Egyéb",
      description: "Nem szerepel a listában – részletezd lentebb.",
    },
  ],
  user: [
    {
      value: 0,
      label: "Hamis adatok / profil",
    },
    {
      value: 1,
      label: "Csalás vagy félrevezető tevékenység",
    },
    {
      value: 2,
      label: "Zaklatás vagy nem megfelelő kommunikáció",
    },
    {
      value: 3,
      label: "Egyéb",
      description: "Nem szerepel a listában – részletezd lentebb.",
    },
  ],
};

const defaultValues: ReportInput = {
  reason: null,
  description: "",
};

const ReportForm = ({ id, type }: ReportFormProps) => {
  const navigate = useNavigate();
  const isMounted = useMounted();

  const numericId = id ? Number(id) : NaN;

  const reportMutation = useReport(() => {
    setTimeout(() => {
      if (isMounted()) {
        navigate(-1);
      }
    }, 1000);
  });

  const form = useAppForm({
    defaultValues,

    validators: {
      onSubmit: reportSchema,
    },

    onSubmit: async ({ value, formApi }) => {
      if (!numericId || Number.isNaN(numericId)) {
        toast.error("Hiányzó vagy érvénytelen azonosító.");
        throw new Error("Invalid id");
      }

      const parsed = reportSchema.parse(value);

      const payload = {
        id: numericId,
        type,
        reason: parsed.reason!,
        description: parsed.description?.trim() || undefined,
      };

      const reportPromise = reportMutation.mutateAsync(payload);

      toast.promise(reportPromise, {
        loading: "Jelentés folyamatban...",
        success: "Jelentés elküldve.",
        error: (err) =>
          (err?.response?.data?.message as string) ||
          `Hiba a ${LABELS[type]} jelentése közben.`,
      });

      await reportPromise;

      formApi.reset();
    },

    onSubmitInvalid: async () => {
      throw new Error("Invalid form submission");
    },
  });

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    await form.handleSubmit();
    if (!form.store.state.isValid) {
      toast.error("Kérjük javítsd a hibás mezőket!");
      throw new Error("Invalid form submission");
    }
  };

  const reasonOptions = REASON_OPTIONS[type];

  return (
    <>
      <h1 className='modal__title'>🚩 {TITLES[type]}</h1>

      <div className='modal__content'>
        <p>{DESCRIPTIONS[type]}</p>

        <form
          className='pt-1'
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}>
          {/* Jelentés oka */}
          <form.AppField
            name='reason'
            validators={{
              onChange: reportSchema.shape.reason,
            }}>
            {(field) => (
              <field.Select
                label='Jelentés oka'
                required
                placeholder='Válassz az alábbiak közül...'
                options={reasonOptions}
              />
            )}
          </form.AppField>

          {/* Részletes leírás */}
          <form.AppField
            name='description'
            validators={{
              onChange: reportSchema.shape.description,
            }}>
            {(field) => (
              <field.TextArea
                label='Részletes leírás'
                placeholder={`Írd le részletesen, miért jelented ezt a ${LABELS_ACCUSATIVE[type]}.`}
                rows={5}
                maxLength={500}
              />
            )}
          </form.AppField>
        </form>
      </div>

      <div className='modal__actions'>
        <Button
          className='secondary'
          text='Mégsem'
          disabled={reportMutation.isPending}
          onClick={() => navigate(-1)}
        />
        <StateButton
          className='secondary red'
          text='Jelentés'
          onClick={handleSubmit}
          disabled={reportMutation.isPending}>
          <Flag />
        </StateButton>
      </div>
    </>
  );
};

export default ReportForm;
