import '../styles/globals.css';
import PageLoadingComponent from '../components/shared/PageLoadingComponent/PageLoadingComponent';
import NavigationBarComponent from '@/components/shared/NavigationBarComponent/NavigationBarComponent';

export default function App({ Component, pageProps }) {
  return (
    <>
      <PageLoadingComponent />
      <Component {...pageProps} />
      <NavigationBarComponent />
    </>
  );
}
