import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Globe, TrendingUp, Shield, Truck, FileText, DollarSign, Package, Users, ChevronRight, CheckCircle, Star, MapPin, ArrowRight, Phone, Mail, Locate as Location, Building, Target, Award, IceCream as Team, ChevronDown, Clock, Briefcase, Box, ShieldCheck, Headphones, Plane, Ship, Warehouse } from 'lucide-react';

export function Home() {
  // Référence pour l'animation au scroll
  const animatedElementsRef = useRef<NodeListOf<Element> | null>(null);

  useEffect(() => {
    // Observer pour les animations au scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    // Sélectionner tous les éléments à animer
    animatedElementsRef.current = document.querySelectorAll('.animate-on-scroll');
    animatedElementsRef.current.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md fixed w-full z-50 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <Globe className="h-8 w-8 text-blue-600 transition-transform group-hover:rotate-180 duration-700" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  LMI
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">Qui sommes-nous</a>
              <a href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">Services</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">Comment ça marche</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              <Link
                to="/track"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Suivi de commande
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80"
          >
            <source
              src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=164&oauth2_token_id=57447761"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-black/50" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-8 leading-tight animate-fade-in-up">
              Votre Partenaire
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text animate-text">
                Import-Export
              </span>
              <br />
              de Confiance
            </h1>
            <p className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto animate-fade-in-up delay-200">
              Simplifiez vos opérations internationales avec LMI. 
              De la commande à la livraison, nous prenons en charge toute la logistique 
              de vos importations et exportations partout dans le monde.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-300">
              <Link
                to="/track"
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all transform hover:scale-105 inline-flex items-center group shadow-lg shadow-blue-500/25"
              >
                Suivre une commande
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#contact"
                className="px-8 py-4 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all transform hover:scale-105 backdrop-blur-sm"
              >
                Nous contacter
              </a>
            </div>
          </div>

          {/* Indicateur de défilement */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="animate-scroll-indicator">
              <ChevronDown className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Section Avantages */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="h-12 w-12" />,
                title: "Service Rapide",
                description: "Traitement et expédition rapides de vos commandes"
              },
              {
                icon: <ShieldCheck className="h-12 w-12" />,
                title: "100% Sécurisé",
                description: "Vos marchandises sont assurées pendant tout le transport"
              },
              {
                icon: <Headphones className="h-12 w-12" />,
                title: "Support 24/7",
                description: "Une équipe dédiée à votre service à tout moment"
              }
            ].map((advantage, index) => (
              <div 
                key={index}
                className="animate-on-scroll bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group"
              >
                <div className="inline-block p-4 rounded-full bg-blue-50 text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                  {advantage.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{advantage.title}</h3>
                <p className="text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Qui sommes-nous */}
      <div id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Qui sommes-nous ?
              </h2>
              <div className="space-y-6">
                <p className="text-lg text-gray-600">
                  Les Missions Impossible (LMI) est une entreprise leader dans le domaine 
                  de l'import-export et de la logistique internationale. Notre expertise 
                  et notre réseau mondial nous permettent de vous offrir des solutions 
                  sur mesure pour tous vos besoins d'import-export.
                </p>
                <div className="space-y-8">
                  {[
                    {
                      icon: <Building className="h-6 w-6" />,
                      title: "Notre Histoire",
                      description: "Depuis notre création, nous avons bâti une réputation d'excellence et de fiabilité dans le secteur de l'import-export."
                    },
                    {
                      icon: <Target className="h-6 w-6" />,
                      title: "Notre Mission",
                      description: "Faciliter les échanges commerciaux internationaux en offrant des solutions logistiques complètes et personnalisées."
                    },
                    {
                      icon: <Award className="h-6 w-6" />,
                      title: "Nos Valeurs",
                      description: "Excellence, intégrité et innovation sont au cœur de notre approche pour garantir votre satisfaction."
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start group">
                      <div className="flex-shrink-0">
                        <div className="p-3 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          {item.icon}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 animate-on-scroll">
              {[
                {
                  number: "15+",
                  label: "Années d'expérience",
                  gradient: "from-blue-500 to-blue-600"
                },
                {
                  number: "50+",
                  label: "Pays desservis",
                  gradient: "from-blue-600 to-blue-700"
                },
                {
                  number: "1000+",
                  label: "Clients satisfaits",
                  gradient: "from-blue-700 to-blue-800"
                },
                {
                  number: "24/7",
                  label: "Support client",
                  gradient: "from-blue-800 to-blue-900"
                }
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`rounded-2xl p-6 bg-gradient-to-br ${stat.gradient} text-white text-center transform hover:scale-105 transition-transform`}
                >
                  <div className="text-3xl font-bold mb-2">{stat.number}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section Services */}
      <div id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nos Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Des solutions complètes et personnalisées pour tous vos besoins d'import-export
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Plane className="h-8 w-8" />,
                title: "Transport Aérien",
                description: "Service rapide pour vos marchandises urgentes",
                features: [
                  "Délais courts",
                  "Suivi en temps réel",
                  "Couverture mondiale"
                ]
              },
              {
                icon: <Ship className="h-8 w-8" />,
                title: "Transport Maritime",
                description: "Solutions économiques pour les grandes quantités",
                features: [
                  "Conteneurs dédiés",
                  "Tarifs compétitifs",
                  "Routes optimisées"
                ]
              },
              {
                icon: <Warehouse className="h-8 w-8" />,
                title: "Stockage & Distribution",
                description: "Gestion complète de votre chaîne logistique",
                features: [
                  "Entrepôts sécurisés",
                  "Gestion des stocks",
                  "Distribution locale"
                ]
              }
            ].map((service, index) => (
              <div 
                key={index} 
                className="animate-on-scroll bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="text-blue-600 mb-6">
                  <div className="inline-block p-3 bg-blue-50 rounded-lg">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Comment ça marche */}
      <div id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Un processus simple et transparent pour vos opérations internationales
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-100 transform -translate-y-1/2 hidden md:block" />
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: <FileText className="h-6 w-6" />,
                  step: "01",
                  title: "Demande",
                  description: "Soumettez votre demande avec les détails de vos besoins"
                },
                {
                  icon: <DollarSign className="h-6 w-6" />,
                  step: "02",
                  title: "Devis",
                  description: "Recevez un devis détaillé sous 24h"
                },
                {
                  icon: <Package className="h-6 w-6" />,
                  step: "03",
                  title: "Expédition",
                  description: "Nous prenons en charge toute la logistique"
                },
                {
                  icon: <Truck className="h-6 w-6" />,
                  step: "04",
                  title: "Livraison",
                  description: "Livraison sécurisée à destination"
                }
              ].map((step, index) => (
                <div key={index} className="animate-on-scroll relative">
                  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative z-10">
                    <div className="absolute -top-4 left-4 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    <div className="mt-4">
                      <div className="inline-block p-3 bg-blue-50 rounded-lg text-blue-600 mb-4">
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section Contact */}
      <div id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Contactez-nous
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Notre équipe est à votre disposition pour répondre à toutes vos questions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                city: "Yaoundé",
                address: "Mvog-Ada Montesquieu",
                phone: ["689 043 593", "653 440 589"],
                email: "service@lesmissionsimpossible.com"
              },
              {
                city: "Douala",
                address: "Rue Gallieni, pas loin de Total Anatole",
                phone: ["697 67 98 58", "674 01 99 94"]
              }
            ].map((office, index) => (
              <div 
                key={index}
                className="animate-on-scroll bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-2xl font-semibold mb-6 text-blue-600">
                  {office.city}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Location className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                    <span>{office.address}</span>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                    <div>
                      {office.phone.map((num, i) => (
                        <div key={i} className="mb-1">{num}</div>
                      ))}
                    </div>
                  </div>
                  {office.email && (
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                      <a 
                        href={`mailto:${office.email}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {office.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Globe className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">LMI</span>
              </div>
              <p className="text-gray-400 mb-6">
                Votre partenaire de confiance pour l'import-export international
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#services" className="hover:text-white transition-colors">Transport Aérien</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Transport Maritime</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Stockage & Distribution</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Conseil Logistique</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/track" className="hover:text-white transition-colors">Suivi de commande</Link></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">À propos de nous</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start">
                  <Location className="h-5 w-5 text-blue-400 mt-1 mr-2" />
                  <span>Yaoundé - Mvog-Ada Montesquieu</span>
                </li>
                <li className="flex items-start">
                  <Location className="h-5 w-5 text-blue-400 mt-1 mr-2" />
                  <span>Douala - Rue Gallieni</span>
                </li>
                <li className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-400 mt-1 mr-2" />
                  <a href="mailto:service@lesmissionsimpossible.com" className="hover:text-white transition-colors">
                    service@lesmissionsimpossible.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Les Missions Impossible. Tous droits réservés.</p>
            <p className="mt-2">
              <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                Accès Plateforme
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
