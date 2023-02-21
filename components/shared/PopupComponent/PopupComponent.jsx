import React, { useState, useCallback, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import ToggleButtonComponent from '../ToggleButtonComponent/ToggleButtonComponent';
import styles from './PopupComponent.module.css';

function PopupComponent({
  title, positiveButtonText, negativeButtonText, onBlur, onResult, accentColor, children,
}) {
  const [result, setResult] = useState();

  const renderChildrenWithAttachedProps = () => React.Children.map(
    children,
    (child) => React.cloneElement(child, {
      value: result,
      onChange: (e) => setResult(e.target.value),
    }),
  );
  const [
    childrenWithAttachedProps,
    setChildrenWithAttachedProps,
  ] = useState(renderChildrenWithAttachedProps());
  useEffect(() => setChildrenWithAttachedProps(renderChildrenWithAttachedProps()), [result]);

  const handleResult = useCallback(() => {
    onResult(result);
    onBlur();
  }, [onBlur, onResult, result]);

  return (
    <aside className={styles.container}>
      <div className={styles.popup}>
        <h2>{title}</h2>
        {childrenWithAttachedProps}
        <div className={styles.buttonsContainer}>
          <ButtonComponent
            onClick={handleResult}
            text={positiveButtonText}
            accentColor={accentColor}
          />
          <ButtonComponent
            onClick={onBlur}
            text={negativeButtonText}
            accentColor="#FFF"
          />
        </div>
      </div>
    </aside>
  );
}

PopupComponent.propTypes = {
  title: PropTypes.string,
  positiveButtonText: PropTypes.string,
  negativeButtonText: PropTypes.string,
  onBlur: PropTypes.func,
  onResult: PropTypes.func,
  accentColor: PropTypes.string,
  children: PropTypes.node,
};

PopupComponent.defaultProps = {
  title: 'Title',
  positiveButtonText: 'Ok',
  negativeButtonText: 'Cancel',
  onBlur: () => {},
  onResult: () => {},
  accentColor: '#FFF',
  children: [],
};

export default PopupComponent;
