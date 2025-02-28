"use client"
import './info.css';

export default function Info({ number, text }) {
  return (
    <div className="badge-container">
      <div className="badge">
        {number} <br />
        {text}
        <span></span>
      </div>
    </div>
  );
}
