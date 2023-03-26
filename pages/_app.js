import '../styles/globals.css';
import PageLoadingComponent from '../components/shared/PageLoadingComponent/PageLoadingComponent';
import NavigationBarComponent from '../components/shared/NavigationBarComponent/NavigationBarComponent';
import MobileOnlyMiddleware from '../middlware/MobileOnlyMiddleware';

export default function App({ Component, pageProps }) {
  return (
    <MobileOnlyMiddleware>
      <PageLoadingComponent />
      <Component {...pageProps} />
      <NavigationBarComponent />
    </MobileOnlyMiddleware>
  );
}
