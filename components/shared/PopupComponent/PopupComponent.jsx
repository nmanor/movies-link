import React, { useState, useCallback, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import styles from './PopupComponent.module.css';

/**
 * Show popup with custom content. If the content children have `value` and `onChange` props,
 * the `onPositiveClick` will return array of the values of thous children on single value if only
 * one child have `value` and `onChange` props. For example if the children are [`input`, `h1`,
 * `input`] then the value of the 2nd input will be in the array in the 2nd place.
 * @param isOpen {boolean} Weather the popup is open or not
 * @param title {string} The title of the popup
 * @param positiveButtonText {string} The text inside the positive button
 * @param negativeButtonText {string} The text inside the negative button
 * @param onNegativeClick {function} A function that is fired when the positive button is clicked
 * @param onPositiveClick {function} A function that is fired when the negative button is clicked
 * @param positiveButtonLoading {boolean} Indicates whether the positive button should display
 * loading
 * @param negativeButtonLoading {boolean} Indicates whether the negative button should display
 * loading
 * @param accentColor {string} Theme color of the popup
 * @param children One or more JSX elements.
 */
export default function PopupComponent({
  isOpen, title, positiveButtonText, negativeButtonText,
  onNegativeClick, onPositiveClick, positiveButtonLoading, negativeButtonLoading,
  accentColor, children,
}) {
  const [results, setResults] = useState({});

  const renderChildrenWithAttachedProps = () => React.Children.map(
    children,
    (child, i) => React.cloneElement(child, {
      value: results[i],
      onChange: (e) => setResults((val) => ({ ...val, [i]: e.target.value })),
    }),
  );
  const [
    childrenWithAttachedProps,
    setChildrenWithAttachedProps,
  ] = useState(renderChildrenWithAttachedProps());
  useEffect(() => setChildrenWithAttachedProps(renderChildrenWithAttachedProps()), [results]);

  const handlePositiveClick = useCallback(() => {
    const resultsArray = Object.values(results);
    onPositiveClick(resultsArray.length === 1 ? resultsArray[0] : resultsArray);
  }, [onPositiveClick, results]);

  return isOpen && (
    <aside className={styles.container}>
      <div className={styles.popup}>
        <h2>{title}</h2>
        {childrenWithAttachedProps}
        <div className={styles.buttonsContainer}>

          <ButtonComponent
            onClick={handlePositiveClick}
            accentColor={accentColor}
            loading={positiveButtonLoading}
          >
            {positiveButtonText}
          </ButtonComponent>

          <ButtonComponent
            onClick={onNegativeClick}
            accentColor={accentColor}
            loading={negativeButtonLoading}
            outline
          >
            {negativeButtonText}
          </ButtonComponent>

        </div>
      </div>
    </aside>
  );
}

PopupComponent.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  positiveButtonText: PropTypes.string,
  negativeButtonText: PropTypes.string,
  onNegativeClick: PropTypes.func,
  onPositiveClick: PropTypes.func,
  positiveButtonLoading: PropTypes.bool,
  negativeButtonLoading: PropTypes.bool,
  accentColor: PropTypes.string,
  children: PropTypes.node,
};

PopupComponent.defaultProps = {
  isOpen: false,
  title: 'Title',
  positiveButtonText: 'Ok',
  negativeButtonText: 'Cancel',
  onNegativeClick: () => {},
  onPositiveClick: () => {},
  positiveButtonLoading: false,
  negativeButtonLoading: false,
  accentColor: '#FFF',
  children: [],
};
