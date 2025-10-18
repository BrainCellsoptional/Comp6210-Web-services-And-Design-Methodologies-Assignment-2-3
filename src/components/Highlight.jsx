import React from 'react';
export default function Highlight({ text }) {
  const highlighted = text
    .replace(/Euclid/gi, '<span style="color: orange; font-weight: bold;">Euclid</span>')
    .replace(/Safe/gi, '<span style="color: green; font-weight: bold;">Safe</span>')
    .replace(/Keter/gi, '<span style="color: red; font-weight: bold;">Keter</span>');

  return <div dangerouslySetInnerHTML={{ __html: highlighted }} />;
}