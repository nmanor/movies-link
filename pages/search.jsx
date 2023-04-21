import React, { useCallback, useEffect, useState } from 'react';
import axios, { HttpStatusCode } from 'axios';
import styles from '../styles/Search.module.css';
import SearchBoxComponent from '../components/SearchPage/SearchBoxComponent/SearchBoxComponent';
import useDebounce from '../hooks/useDebounce';
import ResultsListComponent from '../components/SearchPage/ResultsListComponent/ResultsListComponent';
import getServerSidePropsLoginMiddleware from '../middlware/getServerSidePropsLoginMiddleware';

export default function Search() {
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState('Search');
  const debouncedQuery = useDebounce(query);

  const changeHandler = useCallback((e) => {
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

  return (
    <>
      <title>{title}</title>
      <SearchBoxComponent
        value={query}
        onChange={changeHandler}
        isLoading={isLoading}
        placeholder="Search"
      />
      <div className={styles.container}>
        {noResults && <h3 className={styles.noResults}>No results found</h3>}
        <ResultsListComponent resultsList={results} />
      </div>
    </>
  );
}

export const getServerSideProps = getServerSidePropsLoginMiddleware(() => ({ props: {} }));
