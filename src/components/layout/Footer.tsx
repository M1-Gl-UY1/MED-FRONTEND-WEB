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
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold">MED Motors</span>
            </Link>
            <p className="text-primary-200 text-sm mb-6">
              Votre partenaire de confiance pour l'achat de véhicules premium.
              Qualité, service et expertise depuis 2024.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-9 h-9 bg-primary-400 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-primary-400 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-primary-400 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-primary-400 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/catalogue"
                  className="text-primary-200 hover:text-secondary transition-colors text-sm"
                >
                  Catalogue
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogue?type=AUTOMOBILE"
                  className="text-primary-200 hover:text-secondary transition-colors text-sm"
                >
                  Automobiles
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogue?type=SCOOTER"
                  className="text-primary-200 hover:text-secondary transition-colors text-sm"
                >
                  Scooters
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogue?promo=true"
                  className="text-primary-200 hover:text-secondary transition-colors text-sm"
                >
                  Promotions
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/financement"
                  className="text-primary-200 hover:text-secondary transition-colors text-sm"
                >
                  Financement
                </Link>
              </li>
              <li>
                <Link
                  to="/livraison"
                  className="text-primary-200 hover:text-secondary transition-colors text-sm"
                >
                  Livraison
                </Link>
              </li>
              <li>
                <Link
                  to="/garantie"
                  className="text-primary-200 hover:text-secondary transition-colors text-sm"
                >
                  Garantie
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-primary-200 hover:text-secondary transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-primary-200 text-sm">
                  123 Avenue de l'Indépendance
                  <br />
                  Douala, Cameroun
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                <a
                  href="tel:+237699000000"
                  className="text-primary-200 hover:text-secondary transition-colors text-sm"
                >
                  +237 699 000 000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                <a
                  href="mailto:contact@med-motors.cm"
                  className="text-primary-200 hover:text-secondary transition-colors text-sm"
                >
                  contact@med-motors.cm
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-400">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-200 text-sm">
              &copy; {currentYear} MED Motors. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
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
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
