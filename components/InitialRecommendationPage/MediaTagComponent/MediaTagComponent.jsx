import * as PropTypes from 'prop-types';
import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './MediaTagComponent.module.css';
import { random } from '../../../utils/utils';
import CameraSVGComponent from '../../shared/svg/CameraSVGComponent';
import TvSVGComponent from '../../shared/svg/TvSVGComponent';

const cx = classNames.bind(styles);

function MediaTagComponent({
  id, onChange, title, releaseYear, checked,
}) {
  const [invisible, setInvisible] = useState(true);
  useEffect(() => {
    setTimeout(() => setInvisible(false), random(50, 600));
  }, []);

  return (
    <label htmlFor={id} className={cx(styles.media, { [styles.invisible]: invisible })}>
      <input
        id={id}
        type="checkbox"
        onChange={onChange}
        checked={checked}
      />
      <span className={styles.checkmark}>
        <p>{title}</p>
        <div className={styles.metadata}>
          {id.startsWith('m') ? <CameraSVGComponent /> : <TvSVGComponent />}
          <p>{releaseYear}</p>
        </div>
      </span>
    </label>
  );
}

MediaTagComponent.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  releaseYear: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
};

MediaTagComponent.defaultProps = {
  title: '',
  releaseYear: '1900',
  onChange: () => {},
  checked: false,
};

export default memo(MediaTagComponent);
