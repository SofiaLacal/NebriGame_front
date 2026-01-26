import { FaDiscord, FaReddit, FaTwitch, FaXTwitter, FaInstagram, FaYoutube } from 'react-icons/fa6';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2026 NebriGame. Todos los derechos reservados</p>

      <div className="social">
        <a href="https://discord.com/" target="_blank" rel="noreferrer">
          <FaDiscord size={20} /> Discord
        </a>

        <a href="https://www.reddit.com/" target="_blank" rel="noreferrer">
          <FaReddit size={20} /> Reddit
        </a>

        <a href="https://www.twitch.tv/" target="_blank" rel="noreferrer">
          <FaTwitch size={20} /> Twitch
        </a>

        <a href="https://x.com/" target="_blank" rel="noreferrer">
          <FaXTwitter size={20} /> 
        </a>

        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
          <FaInstagram size={20} /> Instagram
        </a>

        <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">
          <FaYoutube size={20} /> Youtube
        </a>
      </div>
    </footer>
  );
}

export default Footer;