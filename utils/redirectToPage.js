/**
 * Return the params needed to page-redirection from getServerSideProps function
 * @param destination The URI to the destination page
 * @returns {{redirect: {permanent: boolean, destination: string}, props: {}}} The needed parameters
 */
export default function redirectToPage(destination) {
  return {
    redirect: {
      permanent: false,
      destination,
    },
    props: {},
  };
}
