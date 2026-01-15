import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Car,
  Shield,
  Truck,
  CreditCard,
  Star,
  Zap,
  ChevronRight,
} from 'lucide-react';
import VehicleCard from '../components/ui/VehicleCard';
import {
  vehicules,
  getVehiculesEnVedette,
  getVehiculesPopulaires,
  formatPrice,
} from '../data/mockData';

export default function Home() {
  const vehiculesEnVedette = getVehiculesEnVedette();
  const vehiculesPopulaires = getVehiculesPopulaires();

  const categories = [
    {
      name: 'Automobiles',
      count: vehicules.filter(v => v.typeVehicule === 'AUTOMOBILE').length,
      href: '/catalogue?type=AUTOMOBILE',
      icon: Car,
    },
    {
      name: 'Électriques',
      count: vehicules.filter(v => v.typeMoteur === 'ELECTRIQUE').length,
      href: '/catalogue?moteur=ELECTRIQUE',
      icon: Zap,
    },
    {
      name: 'Scooters',
      count: vehicules.filter(v => v.typeVehicule === 'SCOOTER').length,
      href: '/catalogue?type=SCOOTER',
      icon: Car,
    },
    {
      name: 'Promotions',
      count: vehicules.filter(v => v.enPromotion).length,
      href: '/catalogue?promo=true',
      icon: Star,
    },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Garantie Premium',
      description: 'Tous nos véhicules sont couverts par une garantie constructeur complète.',
    },
    {
      icon: Truck,
      title: 'Livraison Gratuite',
      description: 'Livraison offerte dans tout le Cameroun pour tout achat de véhicule.',
    },
    {
      icon: CreditCard,
      title: 'Financement Flexible',
      description: 'Options de paiement adaptées : comptant, crédit ou leasing.',
    },
    {
      icon: Star,
      title: 'Service Excellence',
      description: 'Accompagnement personnalisé du choix à la livraison.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <span className="badge badge-premium mb-4">
                Nouveau : Tesla Model 3 disponible
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Découvrez l'Excellence
                <span className="text-secondary block mt-2">Automobile</span>
              </h1>
              <p className="text-primary-200 text-lg mb-8 max-w-lg">
                MED Motors vous propose une sélection exclusive de véhicules premium.
                Qualité, performance et élégance au meilleur prix.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/catalogue" className="btn-primary text-base">
                  Explorer le catalogue
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/catalogue?promo=true" className="btn-outline border-white text-white hover:bg-white hover:text-primary">
                  Voir les promotions
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800"
                alt="Véhicule premium"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
                <p className="text-sm text-text-light mb-1">À partir de</p>
                <p className="text-2xl font-bold text-secondary">
                  {formatPrice(2750000)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map(category => (
              <Link
                key={category.name}
                to={category.href}
                className="card-hover flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-full bg-secondary-50 flex items-center justify-center mb-4 group-hover:bg-secondary transition-colors">
                  <category.icon className="w-7 h-7 text-secondary group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-semibold text-primary mb-1">{category.name}</h3>
                <p className="text-sm text-text-light">{category.count} véhicules</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title mb-0">Nouveautés & Promotions</h2>
              <p className="text-text-light">Les dernières arrivées et offres spéciales</p>
            </div>
            <Link
              to="/catalogue"
              className="hidden sm:flex items-center gap-2 text-secondary font-medium hover:gap-3 transition-all"
            >
              Voir tout
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehiculesEnVedette.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          <Link
            to="/catalogue"
            className="sm:hidden flex items-center justify-center gap-2 text-secondary font-medium mt-6"
          >
            Voir tout le catalogue
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-12 lg:py-16 bg-primary text-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="badge badge-premium mb-4">Offre limitée</span>
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                Financement à 0% sur 12 mois
              </h2>
              <p className="text-primary-200 mb-6">
                Profitez de notre offre exclusive de financement sans intérêt
                pour l'achat de votre nouveau véhicule. Conditions applicables
                sur une sélection de modèles.
              </p>
              <Link to="/catalogue" className="btn-primary">
                Découvrir les offres
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600"
                alt="Offre financement"
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Vehicles */}
      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title mb-0">Les Plus Populaires</h2>
              <p className="text-text-light">Les véhicules les plus demandés</p>
            </div>
            <Link
              to="/catalogue"
              className="hidden sm:flex items-center gap-2 text-secondary font-medium hover:gap-3 transition-all"
            >
              Voir tout
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehiculesPopulaires.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Pourquoi Choisir MED Motors</h2>
            <p className="text-text-light max-w-2xl mx-auto">
              Nous nous engageons à vous offrir une expérience d'achat exceptionnelle
              avec des services premium adaptés à vos besoins.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="w-14 h-14 rounded-full bg-secondary-50 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-semibold text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-text-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16 gold-gradient text-primary">
        <div className="container text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Prêt à Trouver Votre Véhicule Idéal ?
          </h2>
          <p className="text-primary-600 mb-8 max-w-2xl mx-auto">
            Parcourez notre catalogue complet et trouvez le véhicule qui correspond
            parfaitement à vos attentes et à votre budget.
          </p>
          <Link to="/catalogue" className="btn-secondary text-base">
            Explorer le catalogue
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
