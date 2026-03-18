import { useDebounce } from "@bump/hooks";
import { Search, Settings } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { Link } from "react-router";
import { useToggle } from "react-use";
import { ROUTES } from "../../../routes/routes";

import Button from "../../../components/Button";
import Tooltip from "../../../components/Tooltip";

type InboxHeaderProps = {
  searchKeyDebounced: string;
  onSearchDebounced: (value: string) => void;
};

const InboxHeader = ({
  searchKeyDebounced,
  onSearchDebounced,
}: InboxHeaderProps) => {
  const [isSearching, toggleSearch] = useToggle(false);
  const [searchKey, setSearchKey] = useState<string>(searchKeyDebounced);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);
  };

  useDebounce(
    () => {
      if (onSearchDebounced) {
        onSearchDebounced(searchKey);
      }
    },
    250,
    [searchKey],
  );

  return (
    <header className='inbox__header'>
      {isSearching ? (
        <div>
          <div
            className='search-box'
            onClick={() => searchRef.current?.focus()}>
            <Search />
            <input
              autoFocus
              className='form-control'
              placeholder='Keresés az üzenetek között...'
              onChange={onSearch}
              value={searchKey}
              ref={searchRef}
            />
          </div>
          <Button
            className='tertiary'
            text='Mégsem'
            onClick={() => {
              toggleSearch(false);
              setSearchKey("");
              onSearchDebounced("");
            }}
          />
        </div>
      ) : (
        <div>
          <h1>Üzenetek</h1>
          <div>
            <Tooltip content='Keresés' showDelay={750} placement='bottom'>
              <a onClick={() => toggleSearch(true)}>
                <Search />
              </a>
            </Tooltip>

            <Tooltip content='Beállítások' showDelay={750} placement='bottom'>
              <Link to={ROUTES.SETTINGS.INBOX} target='_blank'>
                <Settings />
              </Link>
            </Tooltip>
          </div>
        </div>
      )}
    </header>
  );
};

export default InboxHeader;
