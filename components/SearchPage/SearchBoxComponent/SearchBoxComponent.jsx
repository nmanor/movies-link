import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './SearchBoxComponent.module.css';
import BlankSearchSVGComponent from '../../shared/svg/Search/BlankSearchSVGComponent';

const cx = classNames.bind(styles);

export default function SearchBoxComponent({
  value, onChange, placeholder, isLoading,
}) {
  return (
    <div className={styles.container}>
      <BlankSearchSVGComponent className={styles.svgIcon} />
      <input
        className={styles.textBox}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <div className={cx(styles.loadingBar, { [styles.isLoading]: isLoading })} />
    </div>
  );
}

SearchBoxComponent.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  isLoading: PropTypes.bool,
};

SearchBoxComponent.defaultProps = {
  value: '',
  onChange: () => {},
  placeholder: '',
  isLoading: false,
};
