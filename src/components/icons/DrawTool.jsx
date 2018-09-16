import React from 'react';

function DrawToolIcon(props) {
  return (
    <svg
      version="1.1"
      x="0px"
      y="0px"
      width="100%"
      height="100%"
      viewBox="0 0 50 50"
      enableBackground="new 0 0 50 50"
    >
      <g id="Layer_1">
        <g>
          <path
            fill={props.fill}
            d="M41.93,12.668l4.598-4.598c0.186-0.186,0.186-0.464,0-0.65l-3.948-3.948c-0.186-0.186-0.463-0.186-0.648,0
            L37.332,8.07L41.93,12.668z"
          />
          <path
            fill={props.fill}
            d="M35.985,9.417L18.988,26.415l-2.043,6.036c-0.139,0.371,0.232,0.697,0.604,0.605l6.038-2.046
            l16.997-16.997L35.985,9.417z"
          />
        </g>
      </g>
      <g id="Layer_2">
        <ellipse
          fill="none"
          stroke={props.fill}
          strokeWidth="2"
          strokeMiterlimit="10"
          cx="10.29"
          cy="39.746"
          rx="5.291"
          ry="5.34"
        />
        <line
          fill="none"
          stroke={props.fill}
          strokeWidth="2"
          strokeMiterlimit="10"
          x1="15.581"
          y1="39.746"
          x2="46.666"
          y2="39.745"
        />
        <ellipse
          id="XMLID_1_"
          display="none"
          fill="none"
          stroke={props.fill}
          strokeWidth="2"
          strokeMiterlimit="10"
          cx="11.386"
          cy="35.065"
          rx="5.291"
          ry="5.34"
        />
        <line
          display="none"
          fill="none"
          stroke={props.fill}
          strokeWidth="2"
          strokeMiterlimit="10"
          x1="-14.517"
          y1="18.795"
          x2="5.905"
          y2="32.951"
        />
        <path
          display="none"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M36.108,41.856c-0.333-0.721-0.653-1.447-1-2.161
          c-0.991-2.037-1.993-4.069-2.991-6.104c-0.026-0.055-0.063-0.105-0.128-0.209c-1.712,1.48-3.407,2.945-5.157,4.458
          c0-6.357,0-12.64,0-19.008c5.121,3.929,10.193,7.821,15.354,11.782c-2.272,0.386-4.444,0.754-6.676,1.133
          c1.393,2.841,2.759,5.629,4.134,8.436c-1.126,0.562-2.235,1.118-3.345,1.673C36.236,41.856,36.172,41.856,36.108,41.856z"
        />
      </g>
    </svg>
  );
}

export default DrawToolIcon;
