import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode-generator';
import PropTypes from 'prop-types';

export default function QRCodeComponent({ data, accentColor, className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const qr = QRCode(0, 'M');
    qr.addData(data);
    qr.make();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cellSize = 4;

    for (let row = 0; row < qr.getModuleCount(); row += 1) {
      for (let col = 0; col < qr.getModuleCount(); col += 1) {
        ctx.fillStyle = qr.isDark(row, col) ? accentColor : '#0000';
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }, [data]);

  return <canvas className={className} ref={canvasRef} />;
}

QRCodeComponent.propTypes = {
  data: PropTypes.string,
  accentColor: PropTypes.string,
  className: PropTypes.string,
};

QRCodeComponent.defaultProps = {
  data: '',
  accentColor: '#FFF',
  className: '',
};
