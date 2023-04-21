import React, { useCallback, useEffect, useState } from 'react';
import axios, { HttpStatusCode } from 'axios';
import classNames from 'classnames/bind';
import styles from '../styles/Search.module.css';
import SearchBoxComponent from '../components/SearchPage/SearchBoxComponent/SearchBoxComponent';
import useDebounce from '../hooks/useDebounce';
import ResultsListComponent from '../components/SearchPage/ResultsListComponent/ResultsListComponent';
import getServerSidePropsLoginMiddleware from '../middlware/getServerSidePropsLoginMiddleware';
import TabsComponent from '../components/SearchPage/TabsComponent/TabsComponent';
import EntityType from '../utils/enums';

const cx = classNames.bind(styles);

const tabs = {
  All: () => true,
  Movies: (e) => e.entityType === EntityType.Movie,
  'TV Shows': (e) => e.entityType === EntityType.Series,
  Actors: (e) => e.entityType === EntityType.Actor,
};

export default function Search() {
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [results, setResults] = useState([]);
  const [displayedResults, setDisplayedResults] = useState([]);
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState('Search');
  const [selectedTab, setSelectedTab] = useState(0);

  const debouncedQuery = useDebounce(query);

  const handleQueryChange = useCallback((e) => {
    setIsLoading(true);
    setQuery(e.target.value);
  }, []);

  const performSearch = async (term) => {
    if (term && term.length > 0) {
      const { status, data } = await axios.get(`/api/search?query=${encodeURIComponent(term.trim())}`);
      if (status === HttpStatusCode.Ok) {
        setResults(data);
        setNoResults(!data || data.length === 0);
        setTitle(`Search of ${term}`);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery]);

  const handleTabChange = useCallback((i) => {
    setSelectedTab(i);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const data = results.filter(Object.values(tabs)[selectedTab]);
    setDisplayedResults(data);

    if (debouncedQuery) setNoResults(!data || data.length === 0);
  }, [results, selectedTab]);

  return (
    <>
      <title>{title}</title>
      <div className={styles.container}>
        <div className={styles.upperBar}>
          <SearchBoxComponent
            value={query}
            onChange={handleQueryChange}
            placeholder="Search"
          />
          <TabsComponent
            tabs={Object.keys(tabs)}
            onChange={handleTabChange}
            selectedTab={selectedTab}
          />
          <div className={cx(styles.loadingBar, { [styles.isLoading]: isLoading })} />
        </div>
        <div className={styles.results}>
          {noResults && <h3 className={styles.noResults}>No results found</h3>}
          <ResultsListComponent resultsList={displayedResults} />
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = getServerSidePropsLoginMiddleware(() => ({ props: {} }));
