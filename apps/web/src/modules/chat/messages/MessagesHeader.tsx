import { useMediaQuery } from "react-responsive";
import { Link, useLocation } from "react-router";

import Image from "../../../components/Image";

import type { UserModel } from "@bump/core/models";
import { ArrowLeft, MoveRight } from "lucide-react";
import { ROUTES } from "../../../routes/routes";

const MessagesHeader = () => {
  const location = useLocation();
  const partner = location.state?.partner as UserModel;

  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  return (
    <header className='messages__header'>
      <div className='messages__header__details'>
        {isMobile && (
          <Link
            to={ROUTES.INBOX.ROOT}
            className='messages__header__details__back'>
            <ArrowLeft />
          </Link>
        )}
        <Image
          src={partner.profilePicture || ""}
          alt={partner.username.slice(0, 2)}
        />
        <div className='messages__header__details__info'>
          <h4>{partner.username}</h4>
          <div className='fc-gray-600 fs-14'>TODO</div>
        </div>

        <MoveRight />
      </div>
    </header>
  );
};

export default MessagesHeader;
