import * as React from 'react';

function GlobeSVGComponent(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-name="Layer 1"
      viewBox="0 0 24 24"
      {...props}
    >
      <path xmlns="http://www.w3.org/2000/svg" d="m12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm0,22c-5.514,0-10-4.486-10-10,0-1.494.33-2.912.92-4.187l1.666,1.751c.265.278.632.436,1.016.436h1.949c.288,0,.564.114.768.318l.373.373c.198.198.309.466.309.745v.963c0,.385.153.753.425,1.025l1.19,1.19c.247.247.386.582.386.931v2.365c0,.602.488,1.09,1.09,1.09h.213c.425,0,.811-.247.989-.633l2.241-4.856c.267-.578.062-1.263-.477-1.601l-2.562-1.601c-.323-.202-.696-.309-1.077-.309h-1.431c-.311,0-.61-.124-.83-.344l-.592-.592c-.312-.312-.312-.817,0-1.128l.529-.529c.243-.243.614-.303.921-.149l.88.44c.361.181.798.11,1.084-.176l.003-.003c.305-.305.363-.778.141-1.147l-.837-1.396c-.175-.292-.171-.654.014-.94.296-.457.78-1.202,1.316-2.016,3.272.2,6.125,1.98,7.801,4.586l-1.59.917c-.49.282-.733.855-.595,1.403l.627,2.507c.09.36.333.662.665.827l2.373,1.178c-.699,4.835-4.871,8.562-9.896,8.562Z" />
    </svg>
  );
}

export default GlobeSVGComponent;