import React from 'react';
import PropTypes from 'prop-types';
import styles from './SearchBoxComponent.module.css';
import BlankSearchSVGComponent from '../../shared/svg/Search/BlankSearchSVGComponent';

export default function SearchBoxComponent({
  value, onChange, placeholder,
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
    </div>
  );
}

SearchBoxComponent.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

SearchBoxComponent.defaultProps = {
  value: '',
  onChange: () => {},
  placeholder: '',
};
