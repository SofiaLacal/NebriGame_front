import { FaDiscord, FaReddit, FaTwitch, FaXTwitter, FaInstagram, FaYoutube } from 'react-icons/fa6';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2026 NebriGame. Todos los derechos reservados</p>

      <div className="social">
        <a href="https://discord.com/" target="_blank">
          <FaDiscord size={20} /> <p>Discord</p>
        </a>

        <a href="https://www.reddit.com/" target="_blank">
          <FaReddit size={20} /> <p>Reddit</p>
        </a>

        <a href="https://www.twitch.tv/" target="_blank">
          <FaTwitch size={20} /> <p>Twitch</p>
        </a>

        <a href="https://x.com/" target="_blank">
          <FaXTwitter size={20} /> <p>Twitter</p>
        </a>

        <a href="https://www.instagram.com/" target="_blank">
          <FaInstagram size={20} /> <p>Instagram</p>
        </a>

        <a href="https://www.youtube.com/" target="_blank">
          <FaYoutube size={20} /> <p>Youtube</p>
        </a>
      </div>
    </footer>
  );
}

export default Footer;