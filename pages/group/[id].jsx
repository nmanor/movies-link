import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { ParallaxProvider } from 'react-scroll-parallax';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../../styles/Group.module.css';
import MembersListComponent from '../../components/GroupPage/MembersListComponent/MembersListComponent';
import ButtonComponent from '../../components/shared/ButtonComponent/ButtonComponent';
import PopupComponent from '../../components/shared/PopupComponent/PopupComponent';
import SnackbarComponent from '../../components/shared/SnackbarComponent/SnackbarComponent';
import QRCodeComponent from '../../components/shared/QRCodeComponent/QRCodeComponent';
import { groupNameToAcronyms } from '../../utils/utils';
import redirectToPage from '../../utils/redirectToPage';
import getServerSidePropsLoginMiddleware from '../../middlware/getServerSidePropsLoginMiddleware';
import { MoviesListComponent } from '../../components/shared/ItemsListComponent/ItemsListComponent';
import BackButtonComponent from '../../components/shared/BackButtonComponent/BackButtonComponent';

const colors = ['#ffadad', '#ffc6ff', '#bdb2ff', '#a0c4ff', '#9bf6ff', '#caffbf', '#fdffb6', '#ffd6a5'];

export default function Group({
  id, name, members, movies, accentColor, joinLink, joinCode, userIsMember,
}) {
  const router = useRouter();

  const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false);
  const [isChangingGroupMembership, setIsChangingGroupMembership] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const changeGroupMembership = async (url, message) => {
    setIsChangingGroupMembership(true);
    setSnackbarMessage(message);
    setShowSnackbar(true);

    const indicateError = () => {
      setSnackbarMessage('An error occurred');
      setShowSnackbar(true);
    };

    try {
      const { data: { success } } = await axios.post(url, { id, joinCode });
      if (!success) indicateError();
      else {
        // TODO: Refactor the page reloading
        await router.push(joinLink);
        router.reload();
      }
    } catch (e) {
      indicateError();
    } finally {
      setIsChangingGroupMembership(false);
    }
  };

  const handleSnackbarHiding = useCallback(() => setShowSnackbar(false), []);
  const handlePopupNegativeClick = useCallback(() => setIsAddMemberPopupOpen(false), []);
  const handleInviteMemberClick = useCallback(() => setIsAddMemberPopupOpen(true), []);
  const handleJoinGroupClick = useCallback(() => changeGroupMembership('/api/groups/join', 'Joining group...'), []);
  const handleLeaveGroupClick = useCallback(() => changeGroupMembership('/api/groups/leave', 'Leaving group...'), []);
  const handlePopupPositiveClick = useCallback(async () => {
    if (navigator.clipboard) {
      const message = `You are welcome to join the ${name} watch group!\nHere is the link: ${joinLink}`;
      await navigator.clipboard.writeText(message);
      setSnackbarMessage('Link copied to clipboard');
      setShowSnackbar(true);
    }
  }, []);

  return (
    <>
      <meta name="theme-color" content={accentColor} />
      <title>{name}</title>
      <BackButtonComponent accentColor={accentColor} />
      <SnackbarComponent
        show={showSnackbar}
        onHiding={handleSnackbarHiding}
        message={snackbarMessage}
      />

      <PopupComponent
        isOpen={isAddMemberPopupOpen}
        title="Add a new member"
        negativeButtonText="Close"
        positiveButtonText="Copy"
        onNegativeClick={handlePopupNegativeClick}
        onPositiveClick={handlePopupPositiveClick}
        accentColor={accentColor}
      >
        <p>Scan the QR code or copy the link and share it.</p>
        <QRCodeComponent
          className={styles.qrCode}
          data={joinLink}
          accentColor={accentColor}
        />
      </PopupComponent>

      <ParallaxProvider>
        <article className={styles.container}>
          <header className={styles.header}>
            <h1
              className={styles.groupIcon}
              style={{ backgroundColor: accentColor }}
            >
              {groupNameToAcronyms(name)}
            </h1>
            <h2 className={styles.groupName}>{name}</h2>
            <p className={styles.membersCounter}>
              {members.length.toLocaleString()}
              {' '}
              members
              {'  '}
              ·
              {'  '}
              {movies.length.toLocaleString()}
              {' '}
              movies
            </p>
          </header>

          <div className={styles.buttonsContainer}>
            {userIsMember ? (
              <>
                <ButtonComponent
                  accentColor={accentColor}
                  onClick={handleInviteMemberClick}
                >
                  Invite Member
                </ButtonComponent>
                <ButtonComponent
                  accentColor={accentColor}
                  loading={isChangingGroupMembership}
                  onClick={handleLeaveGroupClick}
                  outline
                >
                  Leave Group
                </ButtonComponent>
              </>
            ) : (
              <ButtonComponent
                accentColor={accentColor}
                onClick={handleJoinGroupClick}
                loading={isChangingGroupMembership}
              >
                Join Group
              </ButtonComponent>
            )}
          </div>
          {!userIsMember && movies.length > 0 && (
          <p className={styles.joinNote}>
            <strong>Please note:</strong>
            {' '}
            when you join this group,
            {' '}
            {movies.length === 1 ? 'the movie' : `${movies.length} movies`}
            {' '}
            watched in it will automatically be added to your watch list.
          </p>
          )}
          <div className={styles.space} />
          <MembersListComponent members={members} />
          <div className={styles.space} />
          <MoviesListComponent items={movies} title="Shared movies" />
        </article>
      </ParallaxProvider>
    </>
  );
}

Group.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  members: PropTypes.arrayOf(Object),
  movies: PropTypes.arrayOf(Object),
  accentColor: PropTypes.string,
  joinLink: PropTypes.string,
  joinCode: PropTypes.string,
  userIsMember: PropTypes.bool,
};

Group.defaultProps = {
  name: '',
  members: [],
  movies: [],
  accentColor: '#FFF',
  joinLink: '',
  joinCode: '',
  userIsMember: false,
};

export const getServerSideProps = getServerSidePropsLoginMiddleware(async (context) => {
  try {
    const { user } = context.req.session;
    const { id } = context.query;
    const join = context.query.join || null;

    const res = await axios.post(`${process.env.BASE_URL}/api/groups/${id}`, { user: user.googleId, join });
    let data = {};
    if (res.status === 200) {
      data = res.data;
    }

    return { props: { ...data, joinCode: join } };
  } catch (e) {
    return redirectToPage('/404');
  }
});
