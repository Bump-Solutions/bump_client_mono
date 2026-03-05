import { LockKeyhole } from "lucide-react";

const ChangePassword = () => {
  return (
    <div className='page__wrapper'>
      <div className='form-box'>
        <h1 className='page__title'>
          <LockKeyhole /> Jelszó csere
        </h1>
        <p className='page__desc mb-2'>
          Küldünk egy levelet az e-mail címedre, majd a benne található 6
          számjegyű kód megadásával beállíthatod az új jelszavadat.
        </p>

        <form></form>
      </div>
    </div>
  );
};

export default ChangePassword;
