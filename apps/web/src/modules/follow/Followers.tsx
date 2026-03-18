import type { FollowersPageModel } from "@bump/core/models";
import { useState } from "react";
import { useTitle } from "react-use";
import { useProfile } from "../../context/profile/useProfile";
import { useListFollowers } from "../../hooks/user/useListFollowers";

import Spinner from "../../components/Spinner";
import FollowerList from "./FollowersList";
import SearchBar from "./SearchBar";

const Followers = () => {
  const { user } = useProfile();
  useTitle(`@${user.username} követői - Bump`);

  const [searchKeyDebounced, setSearchKeyDebounced] = useState<string>("");

  const {
    data,
    isLoading,
    isFetchingNextPage,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useListFollowers(user.id, searchKeyDebounced);

  const pages: FollowersPageModel[] = data?.pages || [];

  if (isError) {
    return (
      <h4 className='fc-red-500 ta-center py-5'>
        Hiba történt a követők betöltése közben.
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

          {pages[0].followers.length > 0 ? (
            <FollowerList
              pages={pages}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
            />
          ) : (
            <>
              {searchKeyDebounced ? (
                <p className='fc-gray-600 ta-center py-5'>Nincs találat.</p>
              ) : (
                <p className='fc-gray-600 ta-center py-5'>
                  {user?.username} még nem rendelkezik követőkkel.
                </p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Followers;
