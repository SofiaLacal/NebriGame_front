import { FaDiscord, FaReddit, FaTwitch, FaXTwitter, FaInstagram, FaYoutube } from 'react-icons/fa6';
import './Footer.css';

const redes = [
  { href: 'https://discord.com/',      icon: FaDiscord,   label: 'Discord'   },
  { href: 'https://www.reddit.com/',   icon: FaReddit,    label: 'Reddit'    },
  { href: 'https://www.twitch.tv/',    icon: FaTwitch,    label: 'Twitch'    },
  { href: 'https://x.com/',            icon: FaXTwitter,  label: 'Twitter'   },
  { href: 'https://www.instagram.com/', icon: FaInstagram, label: 'Instagram' },
  { href: 'https://www.youtube.com/',  icon: FaYoutube,   label: 'Youtube'   },
];

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} NebriGame. Todos los derechos reservados</p>

      <div className="social">
        {redes.map(({ href, icon: Icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visitar ${label}`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </a>
        ))}
      </div>
    </footer>
  );
}

export default Footer;