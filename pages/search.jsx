import React, { useCallback, useEffect, useState } from 'react';
import { ParallaxProvider } from 'react-scroll-parallax';
import axios, { HttpStatusCode } from 'axios';
import styles from '../styles/Search.module.css';
import SearchBoxComponent from '../components/SearchPage/SearchBoxComponent/SearchBoxComponent';
import useDebounce from '../hooks/useDebounce';
import ResultsListComponent from '../components/SearchPage/ResultsListComponent/ResultsListComponent';
import getServerSidePropsLoginMiddleware from '../middlware/getServerSidePropsLoginMiddleware';

export default function Search() {
  const [isLoading, setIsLoading] = useState(false);
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
      const { status, data } = await axios.get(`/api/search?query=${encodeURIComponent(term)}`);
      if (status === HttpStatusCode.Ok) {
        setResults(data);
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
      <ParallaxProvider>
        <div className={styles.container}>
          <SearchBoxComponent
            value={query}
            onChange={changeHandler}
            isLoading={isLoading}
            placeholder="Search"
          />
          <ResultsListComponent resultsList={results} />
        </div>
      </ParallaxProvider>
    </>
  );
}

export const getServerSideProps = getServerSidePropsLoginMiddleware(() => ({ props: {} }));
