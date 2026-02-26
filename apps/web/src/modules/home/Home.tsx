import { ENUM } from "@bump/utils";

import { useTitle } from "react-use";
import { useAuth } from "../../context/auth/useAuth";

const Home = () => {
  useTitle(`Kezdőlap - ${ENUM.BRAND.NAME}`);

  const { auth } = useAuth();

  return (
    <div>
      Home
      {JSON.stringify(auth)}
    </div>
  );
};

export default Home;
