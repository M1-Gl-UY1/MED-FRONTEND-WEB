import { useState } from 'react';
import { Car, Shield, Truck, CreditCard, Star, Zap } from 'lucide-react';
import {
  HeroSection,
  CategoriesSection,
  VehiclesGridSection,
  PromoBanner,
  FeaturesSection,
  CTASection,
} from '../components/sections';
import { VideoModal } from '../components/ui/VideoModal';
import {
  vehicules,
  getVehiculesEnVedette,
  getVehiculesPopulaires,
} from '../data/mockData';
import pubVideo from '../assets/video/pub_video.mp4';

export default function Home() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const vehiculesEnVedette = getVehiculesEnVedette();
  const vehiculesPopulaires = getVehiculesPopulaires();

  const categories = [
    {
      name: 'Automobiles',
      count: vehicules.filter(v => v.typeVehicule === 'AUTOMOBILE').length,
      href: '/catalogue?type=AUTOMOBILE',
      icon: Car,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      name: 'Électriques',
      count: vehicules.filter(v => v.typeMoteur === 'ELECTRIQUE').length,
      href: '/catalogue?moteur=ELECTRIQUE',
      icon: Zap,
      color: 'bg-green-50 text-green-600',
    },
    {
      name: 'Scooters',
      count: vehicules.filter(v => v.typeVehicule === 'SCOOTER').length,
      href: '/catalogue?type=SCOOTER',
      icon: Car,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      name: 'Promotions',
      count: vehicules.filter(v => v.enPromotion).length,
      href: '/catalogue?promo=true',
      icon: Star,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Garantie Premium',
      description: 'Tous nos véhicules sont couverts par une garantie constructeur complète de 2 à 5 ans.',
    },
    {
      icon: Truck,
      title: 'Livraison Gratuite',
      description: 'Livraison offerte dans tout le Cameroun et à l\'international pour tout achat.',
    },
    {
      icon: CreditCard,
      title: 'Financement Flexible',
      description: 'Options de paiement adaptées à votre budget : comptant, crédit ou leasing.',
    },
    {
      icon: Star,
      title: 'Service Excellence',
      description: 'Un accompagnement personnalisé du choix du véhicule jusqu\'à la livraison.',
    },
  ];

  const stats = [
    { value: '500+', label: 'Véhicules vendus' },
    { value: '98%', label: 'Clients satisfaits' },
    { value: '15+', label: 'Marques partenaires' },
    { value: '24/7', label: 'Support client' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        badge="Nouveau : Tesla Model 3 disponible"
        title={{
          line1: 'Découvrez',
          highlight: "l'Excellence",
          line2: 'Automobile',
        }}
        description="MED Motors vous propose une sélection exclusive de véhicules premium. Qualité, performance et élégance au meilleur prix au Cameroun."
        primaryAction={{
          label: 'Explorer le catalogue',
          href: '/catalogue',
        }}
        secondaryAction={{
          label: 'Voir la vidéo',
          onClick: () => setIsVideoOpen(true),
        }}
        stats={stats}
        image={{
          src: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800',
          alt: 'Véhicule premium',
        }}
        priceTag={{
          label: 'À partir de',
          price: 2750000,
          suffix: 'TTC',
        }}
        featureBadge="Livraison Gratuite"
      />

      {/* Categories Section */}
      <CategoriesSection
        title="Explorez par Catégorie"
        subtitle="Trouvez le véhicule parfait selon vos besoins"
        categories={categories}
      />

      {/* Featured Vehicles Section */}
      <VehiclesGridSection
        label="Sélection Premium"
        title="Nouveautés & Promotions"
        subtitle="Découvrez nos dernières arrivées et offres exclusives"
        vehicles={vehiculesEnVedette}
        action={{
          label: 'Voir tout le catalogue',
          href: '/catalogue',
        }}
        background="gray"
      />

      {/* Promo Banner Section */}
      <PromoBanner
        badge="Offre limitée"
        title={{
          main: 'Financement à 0%',
          highlight: 'sur 12 mois',
        }}
        description="Profitez de notre offre exclusive de financement sans intérêt pour l'achat de votre nouveau véhicule. Conditions applicables sur une sélection de modèles premium."
        primaryAction={{
          label: 'Découvrir les offres',
          href: '/catalogue',
        }}
        secondaryAction={{
          label: 'Voir les promotions',
          href: '/catalogue?promo=true',
        }}
        image={{
          src: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600',
          alt: 'Offre financement',
        }}
        highlight={{
          value: '0%',
          label: 'sur 12 mois',
        }}
      />

      {/* Popular Vehicles Section */}
      <VehiclesGridSection
        label="Tendances"
        title="Les Plus Populaires"
        subtitle="Les véhicules les plus demandés par nos clients"
        vehicles={vehiculesPopulaires}
        action={{
          label: 'Voir tout le catalogue',
          href: '/catalogue',
        }}
        background="gray"
      />

      {/* Features Section */}
      <FeaturesSection
        label="Nos Avantages"
        title="Pourquoi Choisir MED Motors"
        subtitle="Nous nous engageons à vous offrir une expérience d'achat exceptionnelle avec des services premium adaptés à vos besoins."
        features={features}
      />

      {/* CTA Section */}
      <CTASection
        title="Prêt à Trouver Votre Véhicule Idéal ?"
        description="Parcourez notre catalogue complet et trouvez le véhicule qui correspond parfaitement à vos attentes et à votre budget."
        primaryAction={{
          label: 'Explorer le catalogue',
          href: '/catalogue',
        }}
        secondaryAction={{
          label: 'Créer un compte',
          href: '/connexion',
        }}
        variant="gold"
      />

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoSrc={pubVideo}
        title="MED Motors - L'Excellence Automobile"
      />
    </div>
  );
}
