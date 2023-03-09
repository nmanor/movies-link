import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Parallax } from 'react-scroll-parallax';
import styles from './MembersListComponent.module.css';
import MemberComponent from '../MemberComponent/MemberComponent';

const cx = classNames.bind(styles);

export default function MembersListComponent({ members }) {
  const [showRightEdge, setShowRightEdge] = useState(false);
  const [showLeftEdge, setShowLeftEdge] = useState(true);

  const handleScroll = (e) => {
    const { scrollLeft, offsetWidth, scrollWidth } = e.target;
    setShowLeftEdge(scrollLeft <= 1);
    setShowRightEdge(scrollLeft + 1 >= (scrollWidth - offsetWidth));
  };

  return (
    <>
      <h2 className={cx(styles.title)}>Members</h2>
      <Parallax speed={3} className={styles.container}>
        <div className={cx(styles.edge, { [styles.invisible]: showLeftEdge })} />
        <div className={cx(styles.edge, { [styles.invisible]: showRightEdge })} />
        <div className={styles.list} onScroll={handleScroll}>
          {members.map((member) => <MemberComponent key={`${member.firstName}_${member.lastName}`} member={member} />)}
        </div>
      </Parallax>
    </>
  );
}

MembersListComponent.propTypes = {
  members: PropTypes.arrayOf(Object),
};

MembersListComponent.defaultProps = {
  members: [],
};
