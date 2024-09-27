import '../styles/globals.css';
import PageLoadingComponent from '../components/shared/PageLoadingComponent/PageLoadingComponent';
import NavigationBar from '@/components/shared/NavigationBar/NavigationBar';
import MobileOnlyMiddleware from '../middlware/MobileOnlyMiddleware';

export default function App({ Component, pageProps }) {
  return (
    <MobileOnlyMiddleware>
      <PageLoadingComponent />
      <Component {...pageProps} />
      <NavigationBar />
    </MobileOnlyMiddleware>
  );
}
