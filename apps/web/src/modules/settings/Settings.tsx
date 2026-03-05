import "../../styles/css/settings.css";

import { ENUM } from "@bump/utils";
import { useMediaQuery } from "react-responsive";
import { Outlet } from "react-router";
import { useLocation, useTitle } from "react-use";

import Back from "../../components/Back";
import BasicSettingsProvider from "../../context/settings/PersonalSettingsProvider";
import SettingsNav from "./SettingsNav";

const Settings = () => {
  useTitle(`Beállítások - ${ENUM.BRAND.NAME}`);

  const { pathname } = useLocation();
  const isRoot = pathname === "/settings";

  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  if (isMobile) {
    return (
      <section className='settings'>
        <BasicSettingsProvider>
          {isRoot ? (
            <SettingsNav />
          ) : (
            <>
              <Back className='link back' />
              <Outlet />
            </>
          )}
        </BasicSettingsProvider>
      </section>
    );
  }

  return (
    <section className='settings'>
      <BasicSettingsProvider>
        <SettingsNav />
        <Outlet />
      </BasicSettingsProvider>
    </section>
  );
};

export default Settings;
