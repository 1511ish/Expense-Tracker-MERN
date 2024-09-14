// import React from "react";
// import "./Card.css";

// const Card = (props) => {
//   return (
//       <div className={`card ${props.className}`}>
//           {props.children}
//       </div>
//   );
// };

// export default Card;


import React from 'react';

import classes from './Card.module.css';

const Card = (props) => {
  return (
    <div className={`${classes.card} ${props.className}`}>{props.children}</div>
  );
};

export default Card;

