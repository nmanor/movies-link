import React, { useEffect, useRef } from 'react';
import { PropTypes } from 'prop-types';
import styles from './CurveGraphComponent.module.css';
import { rgbColorToTransparent } from '../../../utils/colorExtractor';

export default function CurveGraphComponent({
  data, width, height, lineWidth, accentColor,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const values = [];
    const currentMonth = new Date().getMonth() + 1;
    for (let month = 0; month < 12; month += 1) {
      values.push(data[((month + currentMonth) % 12) + 1]);
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    const max = Math.max(...values) || 0.000001;
    const curvePoints = values.map((point, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((point / max) * height) - lineWidth;
      return { x, y };
    });
    ctx.moveTo(curvePoints[0].x, curvePoints[0].y);
    for (let i = 0; i < curvePoints.length - 1; i += 1) {
      const xc = (curvePoints[i].x + curvePoints[i + 1].x) / 2;
      const yc = (curvePoints[i].y + curvePoints[i + 1].y) / 2;
      ctx.quadraticCurveTo(curvePoints[i].x, curvePoints[i].y, xc, yc);
    }
    ctx.quadraticCurveTo(
      curvePoints[curvePoints.length - 2].x,
      curvePoints[curvePoints.length - 2].y,
      curvePoints[curvePoints.length - 1].x,
      curvePoints[curvePoints.length - 1].y,
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, curvePoints[0].y);
    for (let i = 0; i < curvePoints.length - 1; i += 1) {
      const xc = (curvePoints[i].x + curvePoints[i + 1].x) / 2;
      const yc = (curvePoints[i].y + curvePoints[i + 1].y) / 2;
      ctx.quadraticCurveTo(curvePoints[i].x, curvePoints[i].y, xc, yc);
    }
    ctx.quadraticCurveTo(
      curvePoints[curvePoints.length - 2].x,
      curvePoints[curvePoints.length - 2].y,
      curvePoints[curvePoints.length - 1].x,
      curvePoints[curvePoints.length - 1].y,
    );
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = rgbColorToTransparent(accentColor, 0.35);
    ctx.fill();
  }, [data, width, height, accentColor]);

  const renderMonthLabels = () => {
    const values = [];
    const currentMonth = new Date().getMonth();
    for (let month = 0; month < 12; month += 1) {
      values.unshift(((month + currentMonth) % 12) + 1);
    }

    return [0, 6, 11].map((month) => {
      const date = new Date();
      date.setMonth(values[month] - 1);
      const monthName = date.toLocaleString('en', { month: 'short' });
      return (<p key={month}>{monthName}</p>);
    });
  };

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} width={width} height={height} />
      <div className={styles.labels} style={{ color: accentColor }}>
        {renderMonthLabels()}
      </div>
    </div>
  );
}

CurveGraphComponent.propTypes = {
  data: PropTypes.instanceOf(Object),
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  lineWidth: PropTypes.number,
  accentColor: PropTypes.string,
};

CurveGraphComponent.defaultProps = {
  data: [],
  lineWidth: 2,
  accentColor: '#FFF',
};
