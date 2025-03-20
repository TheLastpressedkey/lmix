import React from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';

export function Documentation() {
  const sections = [
    {
      title: "Tableau de Bord",
      content: [
        {
          title: "Vue d'ensemble",
          steps: [
            "Le tableau de bord affiche un aperçu de toutes vos commandes en cours",
            "En haut, vous trouverez des statistiques clés : nombre total de commandes, commandes terminées, et délai moyen de traitement",
            "Le graphique central montre la répartition des commandes par statut",
            "En bas, la liste des commandes récentes permet un accès rapide aux dernières commandes"
          ]
        },
        {
          title: "Filtrage par période",
          steps: [
            "Cliquez sur le sélecteur de période en haut à droite",
            "Choisissez parmi : aujourd'hui, 7 derniers jours, 30 derniers jours, etc.",
            "Les statistiques et la liste des commandes se mettent à jour automatiquement"
          ]
        }
      ]
    },
    {
      title: "Gestion des Commandes",
      content: [
        {
          title: "Créer une nouvelle commande",
          steps: [
            "1. Cliquez sur le bouton 'Nouvelle Commande' en haut de la page Commandes",
            "2. Sélectionnez un client existant ou créez-en un nouveau :",
            "   - Pour un client existant : utilisez la barre de recherche ou parcourez la liste",
            "   - Pour un nouveau client : cliquez sur 'Nouveau Client' et remplissez le formulaire",
            "3. Une fois le client sélectionné, remplissez les détails de la commande :",
            "   - Nom du produit",
            "   - Quantité",
            "   - Détails techniques (optionnel)",
            "   - Commentaires (optionnel)",
            "4. Cliquez sur 'Créer la commande' pour finaliser"
          ]
        },
        {
          title: "Modifier une commande",
          steps: [
            "1. Trouvez la commande dans la liste des commandes",
            "2. Cliquez sur l'icône de modification (crayon)",
            "3. Modifiez les champs souhaités",
            "4. Pour les administrateurs uniquement :",
            "   - Modification du prix total",
            "   - Gestion de l'acompte",
            "5. Enregistrez les modifications"
          ]
        },
        {
          title: "Mettre à jour le statut",
          steps: [
            "1. Ouvrez les détails de la commande",
            "2. Cliquez sur 'Mettre à jour le statut'",
            "3. Sélectionnez le nouveau statut dans la liste",
            "4. Ajoutez un commentaire si nécessaire",
            "5. Confirmez la mise à jour"
          ]
        },
        {
          title: "Filtrer et rechercher",
          steps: [
            "Utilisez la barre de recherche pour trouver une commande par numéro, client ou produit",
            "Cliquez sur 'Filtres' pour des options avancées :",
            "- Filtrage par statut",
            "- Filtrage par date",
            "- Filtrage par prix",
            "- Filtrage par statut de l'acompte"
          ]
        }
      ]
    },
    {
      title: "Gestion des Clients",
      content: [
        {
          title: "Ajouter un nouveau client",
          steps: [
            "1. Accédez à la page Clients",
            "2. Cliquez sur 'Nouveau Client'",
            "3. Remplissez les informations requises :",
            "   - Prénom et nom",
            "   - Email (optionnel)",
            "   - Téléphone (optionnel)",
            "   - Adresse (optionnel)",
            "4. Cliquez sur 'Créer le client'"
          ]
        },
        {
          title: "Modifier un client",
          steps: [
            "1. Trouvez le client dans la liste",
            "2. Cliquez sur l'icône de modification",
            "3. Mettez à jour les informations",
            "4. Enregistrez les modifications"
          ]
        },
        {
          title: "Créer une commande pour un client",
          steps: [
            "1. Trouvez le client dans la liste",
            "2. Cliquez sur l'icône de commande (paquet)",
            "3. Vous serez redirigé vers le formulaire de nouvelle commande avec le client pré-sélectionné"
          ]
        }
      ]
    },
    {
      title: "Suivi des Commandes",
      content: [
        {
          title: "Suivre une commande (client)",
          steps: [
            "1. Accédez à la page de suivi via le lien public",
            "2. Entrez le numéro de suivi de la commande",
            "3. Visualisez :",
            "   - Le statut actuel avec timeline",
            "   - Les détails de la commande",
            "   - Les informations de paiement",
            "   - Les coordonnées du client"
          ]
        }
      ]
    },
    {
      title: "Gestion des Utilisateurs (Admin)",
      content: [
        {
          title: "Créer un nouvel utilisateur",
          steps: [
            "1. Accédez à la page Gestion Utilisateurs",
            "2. Cliquez sur 'Ajouter un Utilisateur'",
            "3. Remplissez les informations :",
            "   - Email",
            "   - Mot de passe",
            "   - Rôle (admin ou employé)",
            "4. Cliquez sur 'Créer l'utilisateur'"
          ]
        },
        {
          title: "Gérer les utilisateurs",
          steps: [
            "Modifier un utilisateur :",
            "1. Cliquez sur l'icône de modification",
            "2. Mettez à jour le rôle ou l'email",
            "3. Enregistrez les modifications",
            "",
            "Supprimer un utilisateur :",
            "1. Cliquez sur l'icône de suppression",
            "2. Confirmez la suppression"
          ]
        }
      ]
    },
    {
      title: "Cycle de vie d'une commande",
      content: [
        {
          title: "Les différents statuts",
          steps: [
            "1. En attente de prix :",
            "   - Statut initial après création",
            "   - L'administrateur doit définir le prix total",
            "",
            "2. En attente d'acompte :",
            "   - Le prix a été fixé",
            "   - En attente du paiement de l'acompte par le client",
            "",
            "3. Acompte payé :",
            "   - L'acompte a été reçu",
            "   - La commande peut entrer en production",
            "",
            "4. En production :",
            "   - La commande est en cours de traitement",
            "   - Suivi possible de l'avancement",
            "",
            "5. Prêt :",
            "   - La commande est terminée",
            "   - En attente d'expédition",
            "",
            "6. Expédié :",
            "   - La commande a quitté nos locaux",
            "   - En transit vers le client",
            "",
            "7. Livré :",
            "   - La commande a été reçue par le client",
            "   - Transaction terminée",
            "",
            "8. Annulé :",
            "   - La commande a été annulée",
            "   - Aucune autre action possible"
          ]
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documentation"
        description="Guide complet des fonctionnalités de la plateforme"
      />

      <div className="space-y-8">
        {sections.map((section, index) => (
          <Card key={index}>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">
                {section.title}
              </h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-8">
                {section.content.map((subsection, i) => (
                  <div key={i} className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {subsection.title}
                    </h3>
                    <div className="pl-4 space-y-2">
                      {subsection.steps.map((step, j) => (
                        <div key={j} className="text-gray-600">
                          {step.startsWith('- ') ? (
                            <div className="pl-4">{step}</div>
                          ) : step === '' ? (
                            <div className="py-2"></div>
                          ) : (
                            <div>{step}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}