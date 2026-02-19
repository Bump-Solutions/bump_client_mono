import { useNavigate, useSearchParams } from "react-router";

import Spinner from "../../components/Spinner";

const GoogleCallback = () => {
  const [params] = useSearchParams();
  const code = params.get("code");

  const navigate = useNavigate();

  return <Spinner />;
};

export default GoogleCallback;
