import React from "react";
import "../style/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-section">
          <h3>NoVa Fandub</h3>
          <p>Eng yaxshi anime fan sayti</p>
          <p>Manzil: Farg'ona, O'zbekiston</p>
        </div>

        <div className="footer-section">
          <h3>Aloqa</h3>
          <p>Telefon: +998 90 570 28 16</p>
          <p>telegram orqali bog`lanish: @Im_Vox_Aeterna_Vip</p>
        </div>

        <div className="footer-section">
          <h3>Ijtimoiy tarmoqlar</h3>
          <div className="socials">
            <a href="https://t.me/NoVa_Fandub_Rasmiy"><i className="fa-brands fa-telegram"></i></a>
            <a href="https://www.instagram.com/ego.dublyaj?igsh=MTlrOWlxb24wdGozag=="><i className="fa-brands fa-instagram"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 NoVa Fandub. Barcha huquqlar himoyalangan.</p>
      </div>
    </footer>
  );
}
