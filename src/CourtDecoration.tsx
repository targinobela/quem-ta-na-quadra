import React from 'react';

export default function CourtDecoration() {
  return (
    <div className="court-art" aria-hidden="true">
      <svg className="art-left" viewBox="0 0 200 660" preserveAspectRatio="none">
        <path className="blue" d="M-40 10C190 90 0 210 160 340S10 540 120 700" />
        <path className="green" d="M-35 110C170 180 30 270 130 390S5 580 65 700" />
        <path className="yellow" d="M-30 240C130 200 70 380 160 470S10 630 30 700" />
      </svg>
      <svg className="art-right" viewBox="0 0 200 660" preserveAspectRatio="none">
        <path className="yellow" d="M240 20C20 90 200 230 65 350S200 530 75 700" />
        <path className="green" d="M240 180C55 170 190 390 75 450S200 600 140 700" />
        <path className="blue" d="M230 330C80 280 180 490 95 560S170 650 180 700" />
      </svg>
    </div>
  );
}
