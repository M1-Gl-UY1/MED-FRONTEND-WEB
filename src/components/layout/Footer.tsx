import { Link } from 'react-router-dom';
import {
  Car,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white mt-auto">
      {/* Main Footer Content */}
      <div className="container py-10 sm:py-12 md:py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-secondary rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold">MED Motors</span>
            </Link>
            <p className="text-primary-200 text-sm leading-relaxed mb-6 max-w-xs">
              Votre partenaire de confiance pour l'achat de véhicules premium.
              Qualité, service et expertise depuis 2024.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-primary-400 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary-400 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary-400 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary-400 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors"
                aria-label="Youtube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-5">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/catalogue"
                  className="text-primary-200 hover:text-secondary transition-colors text-sm inline-block py-1"
                >
                  Catalogue
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogue?type=AUTOMOBILE"
                  className="text-primary-200 hover:text-secondary transition-colors text-sm inline-block py-1"
                >
                  Automobiles
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogue?type=SCOOTER"
                  className="text-primary-200 hover:text-secondary transition-colors text-sm inline-block py-1"
                >
                  Scooters
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogue?promo=true"
                  className="text-primary-200 hover:text-secondary transition-colors text-sm inline-block py-1"
                >
                  Promotions
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base font-semibold mb-5">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/financement"
                  className="text-primary-200 hover:text-secondary transition-colors text-sm inline-block py-1"
                >
                  Financement
                </Link>
              </li>
              <li>
                <Link
                  to="/livraison"
                  className="text-primary-200 hover:text-secondary transition-colors text-sm inline-block py-1"
                >
                  Livraison
                </Link>
              </li>
              <li>
                <Link
                  to="/garantie"
                  className="text-primary-200 hover:text-secondary transition-colors text-sm inline-block py-1"
                >
                  Garantie
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-primary-200 hover:text-secondary transition-colors text-sm inline-block py-1"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold mb-5">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-primary-200 text-sm leading-relaxed">
                  123 Avenue de l'Indépendance
                  <br />
                  Douala, Cameroun
                </span>
              </li>
              <li>
                <a
                  href="tel:+237699000000"
                  className="flex items-center gap-3 text-primary-200 hover:text-secondary transition-colors"
                >
                  <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-sm">+237 699 000 000</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@med-motors.cm"
                  className="flex items-center gap-3 text-primary-200 hover:text-secondary transition-colors"
                >
                  <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-sm">contact@med-motors.cm</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-400">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-primary-200 text-sm text-center sm:text-left">
              &copy; {currentYear} MED Motors. Tous droits réservés.
            </p>
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <Link
                to="/mentions-legales"
                className="text-primary-200 hover:text-secondary transition-colors text-sm"
              >
                Mentions légales
              </Link>
              <Link
                to="/confidentialite"
                className="text-primary-200 hover:text-secondary transition-colors text-sm"
              >
                Confidentialité
              </Link>
              <Link
                to="/cgv"
                className="text-primary-200 hover:text-secondary transition-colors text-sm"
              >
                CGV
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
