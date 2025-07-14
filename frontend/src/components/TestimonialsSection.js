import React from 'react';

const TestimonialsSection = ({ testimonials }) => {
  const defaultTestimonials = [
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
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <section className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Depoimentos de Quem Já Lucra
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Veja os resultados reais de pessoas que aplicaram o método
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
              🏆 RESULTADOS COMPROVADOS
            </h3>
            <p className="text-green-100">
              Mais de 1.000 pessoas já transformaram suas vidas com nosso método
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;