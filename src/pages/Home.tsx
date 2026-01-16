import { useState, useEffect } from 'react';
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
import { vehiculeService } from '../services';
import type { Vehicule } from '../services/types';
import pubVideo from '../assets/video/pub_video.mp4';

export default function Home() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [vehiculesEnVedette, setVehiculesEnVedette] = useState<Vehicule[]>([]);
  const [vehiculesPopulaires, setVehiculesPopulaires] = useState<Vehicule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allVehicules = await vehiculeService.getAllCustom();
        setVehicules(allVehicules);

        // Véhicules en vedette: nouveaux ou en promotion
        const enVedette = allVehicules.filter(v => v.nouveau || v.solde).slice(0, 4);
        setVehiculesEnVedette(enVedette.length > 0 ? enVedette : allVehicules.slice(0, 4));

        // Véhicules populaires: les plus récents ou aléatoires
        const populaires = allVehicules
          .filter(v => !enVedette.includes(v))
          .slice(0, 4);
        setVehiculesPopulaires(populaires.length > 0 ? populaires : allVehicules.slice(0, 4));
      } catch (error) {
        console.error('Erreur lors du chargement des véhicules:', error);
        setVehicules([]);
        setVehiculesEnVedette([]);
        setVehiculesPopulaires([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = [
    {
      name: 'Automobiles',
      count: vehicules.filter(v => v.type === 'AUTOMOBILE').length,
      href: '/catalogue?type=AUTOMOBILE',
      icon: Car,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      name: 'Électriques',
      count: vehicules.filter(v => v.engine === 'ELECTRIQUE').length,
      href: '/catalogue?moteur=ELECTRIQUE',
      icon: Zap,
      color: 'bg-green-50 text-green-600',
    },
    {
      name: 'Scooters',
      count: vehicules.filter(v => v.type === 'SCOOTER').length,
      href: '/catalogue?type=SCOOTER',
      icon: Car,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      name: 'Promotions',
      count: vehicules.filter(v => v.solde).length,
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
    { value: vehicules.length > 0 ? `${vehicules.length}+` : '0', label: 'Véhicules disponibles' },
    { value: '98%', label: 'Clients satisfaits' },
    { value: '15+', label: 'Marques partenaires' },
    { value: '24/7', label: 'Support client' },
  ];

  // Calculer le prix minimum des véhicules disponibles
  const prixMinimum = vehicules.length > 0
    ? Math.min(...vehicules.map(v => v.prixBase))
    : 0;

  // Trouver un véhicule vedette pour l'image du hero
  const vehiculeVedette = vehiculesEnVedette[0];
  const heroImage = vehiculeVedette?.images?.[0]?.url
    || 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800';

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        badge={vehiculeVedette ? `Nouveau : ${vehiculeVedette.marque} ${vehiculeVedette.nom}` : "Bienvenue chez MED Auto"}
        title={{
          line1: 'Découvrez',
          highlight: "l'Excellence",
          line2: 'Automobile',
        }}
        description="MED Auto vous propose une sélection exclusive de véhicules premium. Qualité, performance et élégance au meilleur prix au Cameroun."
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
          src: heroImage,
          alt: vehiculeVedette ? `${vehiculeVedette.marque} ${vehiculeVedette.nom}` : 'Véhicule premium',
        }}
        priceTag={prixMinimum > 0 ? {
          label: 'À partir de',
          price: prixMinimum,
          suffix: 'TTC',
        } : undefined}
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
        loading={loading}
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
        loading={loading}
      />

      {/* Features Section */}
      <FeaturesSection
        label="Nos Avantages"
        title="Pourquoi Choisir MED Auto"
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
        title="MED Auto - L'Excellence Automobile"
      />
    </div>
  );
}
