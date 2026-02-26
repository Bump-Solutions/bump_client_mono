import { Link } from "react-router";
import { ROUTES } from "../../routes/routes";

const NavMenuMobile = () => {
  return (
    <div className='navbar__menu--mobile'>
      <Link to={ROUTES.HOME} className='fw-800'>
        bump.
      </Link>
    </div>
  );
};

export default NavMenuMobile;
