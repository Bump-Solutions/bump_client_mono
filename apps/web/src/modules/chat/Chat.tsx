import "../../styles/css/chat.css";

import { ENUM } from "@bump/utils";
import { useMediaQuery } from "react-responsive";
import { Link, Outlet, useParams } from "react-router";
import { useTitle } from "react-use";
import { ROUTES } from "../../routes/routes";

import Empty from "../../components/Empty";
import Inbox from "./inbox/Inbox";

import { MessageSquareDashed, MessageSquarePlus } from "lucide-react";

const Chat = () => {
  useTitle(`Üzenetek - ${ENUM.BRAND.NAME}`);

  const { chat } = useParams();

  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  if (isMobile) {
    return (
      <section className='chat'>
        {chat ? <Outlet context={{ chat }} /> : <Inbox />}
      </section>
    );
  }

  return (
    <>
      <div className='border' />
      <section className='chat'>
        <Inbox />
        {chat ? (
          <Outlet key={chat} context={{ chat }} />
        ) : (
          <div className='messages__panel no-selection'>
            <Empty
              icon={<MessageSquareDashed className='svg-40' />}
              title='Nincs kiválasztva chat'
              description='Válassz az üzeneteid közül vagy indíts új beszélgetést.'>
              <Link
                to={ROUTES.HOME}
                className='button primary w-fc mx-auto fw-600'>
                <MessageSquarePlus />
                Új üzenet indítása
              </Link>
            </Empty>
          </div>
        )}
      </section>
    </>
  );
};

export default Chat;
