import React, { useState } from "react";
function Header({ clearChat }) {
  const [isClicked, setIsClicked] = useState(false);
  const [messages, setMessages] = useState([]);
  return (
    <div className="head">
        
      <header><h1>Healnest!</h1></header>
      
    </div>
  );
}

export default Header;