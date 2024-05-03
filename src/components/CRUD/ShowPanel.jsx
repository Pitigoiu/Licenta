import React, { useState } from "react";
export default function ShowPanel({ tabs }) {
  const [currentPanel, setCurrentPanel] = useState(0);
  function handleClick(getIndex) {
    setCurrentPanel(getIndex);
  }

  return (
    <div>
      <div className="heading">
        {tabs.map((item, index) => (
          <div
            className={`tab-item ${currentPanel === index ? "active" : ""}`}
            onClick={() => handleClick(index)}
            key={item.label}
          >
            <span className="label">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="content">
        {tabs[currentPanel] && tabs[currentPanel].content}
      </div>
    </div>
  );
}
