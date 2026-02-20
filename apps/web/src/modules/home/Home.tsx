import { ENUM } from "@bump/utils";

import { useTitle } from "react-use";

const Home = () => {
  useTitle(`Kezdőlap - ${ENUM.BRAND.NAME}`);

  return <div>Home</div>;
};

export default Home;
