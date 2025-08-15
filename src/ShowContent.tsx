import React, { useState } from "react";

const ShowContent = ({ text }: { text: string }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="flex">
      {show ? <p>{text}</p> : <p>{"*".repeat(text.length)}</p>}
      <button onClick={() => setShow(!show)}>{show ? "🚫" : "👀"}</button>
    </div>
  );
};

export default ShowContent;
