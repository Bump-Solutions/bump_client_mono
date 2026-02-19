import "../../styles/css/authentication.css";

import { ENUM } from "@bump/utils";
import { Outlet } from "react-router";

import Hero from "./Hero";

const Authentication = () => {
  return (
    <section className='authentication'>
      <Hero />

      <div className='authentication__wrapper'>
        <h1 className='title--brand'>{ENUM.BRAND.NAME}</h1>
        <Outlet />
      </div>
    </section>
  );
};

export default Authentication;
