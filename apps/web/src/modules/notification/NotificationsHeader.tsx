import { toast } from "sonner";
import { useGetProfileMeta } from "../../hooks/profile/useGetProfileMeta";

import Back from "../../components/Back";

const NotificationsHeader = () => {
  const { data: meta, isError, error } = useGetProfileMeta();

  if (isError) {
    toast.error(
      error?.message || "Hiba történt a profil metaadatok lekérése közben.",
    );
  }

  return (
    <>
      <Back className='link mb-1' />
      <header className='notifications__header'>
        <div>
          <h1>Értesítések</h1>
          {!!meta?.unreadNotifications && meta.unreadNotifications > 0 && (
            <span className='badge fw-600'>{meta.unreadNotifications}</span>
          )}
        </div>
        <button type='button'>Összes megjelölése olvasottként</button>
      </header>
    </>
  );
};

export default NotificationsHeader;
