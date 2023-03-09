import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import styles from './MemberComponent.module.css';

export default function MemberComponent({ member: { firstName, lastName, image } }) {
  return (
    <div className={styles.container}>
      <Image
        alt={`Image of ${firstName}`}
        src={image}
        width={70}
        height={70}
      />
      <p>
        {firstName}
        {' '}
        {lastName}
      </p>
    </div>
  );
}

MemberComponent.propTypes = {
  member: PropTypes.instanceOf(Object),
};

MemberComponent.defaultProps = {
  member: [],
};
