import '@/styles/globals.css';
import PageLoadingComponent from '../components/shared/PageLoadingComponent/PageLoadingComponent';

export default function App({ Component, pageProps }) {
  return (
    <>
      <PageLoadingComponent />
      <Component {...pageProps} />
    </>
  );
}
