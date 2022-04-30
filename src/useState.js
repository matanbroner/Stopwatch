import React from "react";

function useState(defaultVal) {
  // getting the state
  const [state, setState] = React.useState(defaultVal);
  // state holding ref
  const stateRef = React.useRef();
  stateRef.current = state; // setting directly here!
  // Because we need to return things at the end of the hook execution
  // not an effect

  // getter
  function getState() {
    // returning the ref (not the state directly)
    // So getter can be used any where!
    return stateRef.current;
  }

  return [state, setState, getState];
}

export default useState;
