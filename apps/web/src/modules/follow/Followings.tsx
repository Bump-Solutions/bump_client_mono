import type { FollowingsPageModel } from "@bump/core/models";
import { useState } from "react";
import { useTitle } from "react-use";
import { useProfile } from "../../context/profile/useProfile";
import { useListFollowings } from "../../hooks/user/useListFollowings";

import Spinner from "../../components/Spinner";
import FollowingList from "./FollowingList";
import SearchBar from "./SearchBar";

const Followings = () => {
  const { user } = useProfile();
  useTitle(`@${user.username} követései - Bump`);

  const [searchKeyDebounced, setSearchKeyDebounced] = useState<string>("");

  const { data, isLoading, isFetchingNextPage, isError, fetchNextPage } =
    useListFollowings(user.id, searchKeyDebounced);

  const pages: FollowingsPageModel[] = data?.pages || [];

  if (isError) {
    return (
      <h4 className='fc-red-500 ta-center py-5'>
        Hiba történt a követések betöltése közben.
      </h4>
    );
  }

  if (isLoading) {
    return (
      <div className='relative py-5'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className='modal__content'>
      {pages.length > 0 && (
        <>
          <SearchBar
            searchKeyDebounced={searchKeyDebounced}
            onSearchDebounced={(debouncedValue) => {
              setSearchKeyDebounced(debouncedValue);
            }}
          />

          {pages[0].followings.length > 0 ? (
            <FollowingList
              pages={pages}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          ) : (
            <>
              {searchKeyDebounced ? (
                <p className='fc-gray-600 ta-center py-5'>Nincs találat.</p>
              ) : (
                <p className='fc-gray-600 ta-center py-5'>
                  {user?.username} még nem rendelkezik követésekkel.
                </p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Followings;
