import { FileText, Download, Book, Receipt, FileCheck } from 'lucide-react';
import { Button, Breadcrumb } from '../components/ui';
import { generateCahierDesCharges } from '../lib/cahierDesCharges';

export default function Documents() {
  const documents = [
    {
      id: 'cahier-charges',
      title: 'Cahier des Charges',
      description: 'Document complet des spécifications fonctionnelles et techniques du projet MED Auto.',
      icon: Book,
      color: 'bg-blue-50 text-blue-600',
      onClick: () => generateCahierDesCharges(),
      pages: '~25 pages',
    },
    {
      id: 'guide-utilisateur',
      title: 'Guide Utilisateur',
      description: 'Manuel d\'utilisation de la plateforme pour les clients finaux.',
      icon: FileText,
      color: 'bg-green-50 text-green-600',
      onClick: () => alert('Guide utilisateur - À venir'),
      pages: 'À venir',
      disabled: true,
    },
    {
      id: 'guide-deploiement',
      title: 'Guide de Déploiement',
      description: 'Instructions techniques pour la mise en production de l\'application.',
      icon: FileCheck,
      color: 'bg-purple-50 text-purple-600',
      onClick: () => alert('Guide de déploiement - À venir'),
      pages: 'À venir',
      disabled: true,
    },
    {
      id: 'documentation-api',
      title: 'Documentation API',
      description: 'Référence des endpoints API et structures de données.',
      icon: Receipt,
      color: 'bg-amber-50 text-amber-600',
      onClick: () => alert('Documentation API - À venir'),
      pages: 'À venir',
      disabled: true,
    },
  ];

  return (
    <div className="py-6 sm:py-8 lg:py-10">
      <div className="container max-w-4xl">
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Documents Projet' },
          ]}
          className="mb-5 md:mb-6"
        />

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-3">
            Documents du Projet
          </h1>
          <p className="text-content-light">
            Téléchargez les documents officiels du projet MED Auto.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {documents.map((doc) => {
            const IconComponent = doc.icon;
            return (
              <div
                key={doc.id}
                className={`card flex flex-col sm:flex-row sm:items-center gap-4 ${
                  doc.disabled ? 'opacity-60' : ''
                }`}
              >
                <div className={`w-14 h-14 rounded-xl ${doc.color} flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className="w-7 h-7" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-primary mb-1">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-content-light mb-2">
                    {doc.description}
                  </p>
                  <span className="inline-block text-xs text-content-muted bg-gray-100 px-2 py-1 rounded">
                    {doc.pages}
                  </span>
                </div>

                <Button
                  onClick={doc.onClick}
                  disabled={doc.disabled}
                  leftIcon={<Download className="w-4 h-4" />}
                  className="flex-shrink-0"
                >
                  Télécharger PDF
                </Button>
              </div>
            );
          })}
        </div>

        <div className="mt-10 p-6 bg-primary-50 rounded-xl">
          <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            À propos des documents
          </h3>
          <ul className="space-y-2 text-sm text-content-light">
            <li>• Les documents sont générés dynamiquement au format PDF</li>
            <li>• Le cahier des charges contient toutes les spécifications du projet</li>
            <li>• Les documents supplémentaires seront disponibles prochainement</li>
            <li>• Contactez l'équipe technique pour toute question</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
