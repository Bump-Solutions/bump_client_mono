import { defineStepper } from "@stepperize/react";
import { Link } from "react-router";
import {
  sellDetailsStepSchema,
  sellItemsStepSchema,
  sellSelectStepSchema,
  sellUploadStepSchema,
} from "../../schemas/sellWizard";

import { ArrowUpRight } from "lucide-react";

export const {
  Scoped: SellScoped,
  useStepper: useSellStepper,
  steps: SELL_STEPS,
} = defineStepper(
  {
    id: "select",
    title: "Már nem használod? Itt az ideje eladni! 💸",
    description: (
      <>
        Válassz{" "}
        <Link className='link no-anim gap-0' to='/' target='_blank'>
          katalógusból <ArrowUpRight className='svg-16 ml-0_25' />
        </Link>
        , vagy add meg a részleteket Te magad!
      </>
    ),
    schema: sellSelectStepSchema,
    basePath: "select",
  },
  {
    id: "details",
    title: (
      <>
        Add meg a termék részleteit! 📝
        <br />
        Minél több infót adsz meg, annál könnyebb az eladás.
      </>
    ),
    description: (
      <>
        Kérjük, tüntesd fel a termék méretét, állapotát és más fontos
        jellemzőit.
        <br />
        Ezek az információk segítenek a potenciális vásárlóknak megalapozott
        döntést hozni.
      </>
    ),
    schema: sellDetailsStepSchema,
    basePath: "details",
  },
  {
    id: "items",
    title: "Részletezd az eladó tételeket! 💰",
    description: (
      <>
        <b>Egy termékhez több tétel is tartozhat.</b>
        <br />
        Add meg a méretet, árat, állapotot és készletet minden eladásra szánt
        tételhez.
        <br />
        Segíts a vásárlóknak megtalálni a nekik megfelelő terméket!
      </>
    ),
    schema: sellItemsStepSchema,
    basePath: "items",
  },
  {
    id: "upload",
    title: "Készíts képeket a cuccodról! 📸",
    description: (
      <>
        <span className='fc-red-500'>Kifejezetten fontos</span>, hogy a saját
        képeidet töltsd fel! Mások képeinek jogtalan felhasználása az oldalról
        való{" "}
        <Link className='link no-anim gap-0' to='/' target='_blank'>
          kitiltással <ArrowUpRight className='svg-16' />
        </Link>
        járhat.
        <br />
        Minimum 3, maximum 10 képet tölthetsz fel, amelyek egyenként legfeljebb
        5 MB méretűek lehetnek.
      </>
    ),
    schema: sellUploadStepSchema,
    basePath: "upload",
  },
);
