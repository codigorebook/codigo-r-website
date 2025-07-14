import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const TestimonialsSection = ({ testimonials }) => {
  const { t, currentLanguage } = useLanguage();

  const defaultTestimonials = {
    pt: [
      {
        name: 'Carlos Silva',
        role: 'Trader Iniciante',
        content: 'Em apenas 2 meses usando o método do Codigo R, consegui recuperar tudo que perdi antes e ainda lucrei 300%. Simplesmente incrível!',
        rating: 5
      },
      {
        name: 'Ana Costa',
        role: 'Empresária',
        content: 'Nunca imaginei que fosse possível ganhar dinheiro com trading. O setup é muito claro e fácil de seguir. Já estou lucrando!',
        rating: 5
      },
      {
        name: 'Pedro Santos',
        role: 'Estudante',
        content: 'Comecei com R$ 500 e em 3 meses já tinha R$ 5.000. O método realmente funciona se você seguir exatamente como ensina.',
        rating: 5
      }
    ],
    en: [
      {
        name: 'John Smith',
        role: 'Beginner Trader',
        content: 'In just 2 months using the Codigo R method, I recovered everything I lost before and even made 300% profit. Simply incredible!',
        rating: 5
      },
      {
        name: 'Sarah Johnson',
        role: 'Entrepreneur',
        content: 'I never imagined it was possible to make money with trading. The setup is very clear and easy to follow. I\'m already profiting!',
        rating: 5
      },
      {
        name: 'Mike Davis',
        role: 'Student',
        content: 'I started with $500 and in 3 months I already had $5,000. The method really works if you follow exactly as taught.',
        rating: 5
      }
    ],
    es: [
      {
        name: 'Carlos Rodríguez',
        role: 'Trader Principiante',
        content: 'En solo 2 meses usando el método de Codigo R, logré recuperar todo lo que perdí antes y además gané 300%. ¡Simplemente increíble!',
        rating: 5
      },
      {
        name: 'María González',
        role: 'Empresaria',
        content: 'Nunca imaginé que fuera posible ganar dinero con trading. La configuración es muy clara y fácil de seguir. ¡Ya estoy ganando!',
        rating: 5
      },
      {
        name: 'Luis Martínez',
        role: 'Estudiante',
        content: 'Comencé con $500 y en 3 meses ya tenía $5,000. El método realmente funciona si sigues exactamente como enseña.',
        rating: 5
      }
    ],
    it: [
      {
        name: 'Marco Rossi',
        role: 'Trader Principiante',
        content: 'In soli 2 mesi usando il metodo Codigo R, sono riuscito a recuperare tutto quello che avevo perso prima e ho guadagnato il 300%. Semplicemente incredibile!',
        rating: 5
      },
      {
        name: 'Giulia Bianchi',
        role: 'Imprenditrice',
        content: 'Non avrei mai immaginato che fosse possibile guadagnare con il trading. La configurazione è molto chiara e facile da seguire. Sto già guadagnando!',
        rating: 5
      },
      {
        name: 'Andrea Ferrari',
        role: 'Studente',
        content: 'Ho iniziato con €500 e in 3 mesi avevo già €5.000. Il metodo funziona davvero se segui esattamente come insegna.',
        rating: 5
      }
    ],
    fr: [
      {
        name: 'Pierre Dubois',
        role: 'Trader Débutant',
        content: 'En seulement 2 mois en utilisant la méthode Codigo R, j\'ai réussi à récupérer tout ce que j\'avais perdu avant et j\'ai même gagné 300%. Tout simplement incroyable!',
        rating: 5
      },
      {
        name: 'Sophie Martin',
        role: 'Entrepreneure',
        content: 'Je n\'aurais jamais imaginé qu\'il était possible de gagner de l\'argent avec le trading. La configuration est très claire et facile à suivre. Je gagne déjà!',
        rating: 5
      },
      {
        name: 'Antoine Leroy',
        role: 'Étudiant',
        content: 'J\'ai commencé avec 500€ et en 3 mois j\'avais déjà 5 000€. La méthode fonctionne vraiment si vous suivez exactement comme enseigné.',
        rating: 5
      }
    ]
  };

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials[currentLanguage] || defaultTestimonials['pt'];

  return (
    <section className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {t('testimonials.title')}
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">⭐</span>
                ))}
              </div>
              <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
              <div className="border-t border-gray-700 pt-4">
                <div className="font-bold text-white">{testimonial.name}</div>
                <div className="text-gray-400 text-sm">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-2">
              {t('testimonials.results')}
            </h3>
            <p className="text-green-100">
              {t('testimonials.results.desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;