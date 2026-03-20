import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Lauren Lee",
      location: "Taft Office",
      text: "I started with this practice as a new patient back in 2013. I love the staff and physicians they have always been the kindest most helpful office I have ever been with. Always pleasant and they always get the job done. They are in my eyes a blessing to have found an amazing practice that never let me down... I highly recommend this practice they do not forget your needs what so ever...",
      rating: 5,
    },
    {
      name: "Sheree",
      location: "Taft Office",
      text: "The entire staff was attentive and courteous, from the front desk to the back office. I have been seeing Dr. Joseph Mascenik for eight years, and I will follow him wherever he goes. He is always precise, sincere, caring, and kind. I truly appreciate his knowledge and the care he provides as my doctor.",
      rating: 5,
    },
    {
      name: "Milena Sarmiento",
      location: "Johnson Office",
      text: "It was an incredible experience—everyone was so attentive and wonderful that they exceeded all my expectations. The front desk was friendly, efficient, and professional. The assistants felt like friends, guiding me through the entire process. And Dr. Pena Alcantara is one of the most understanding, caring, and empathetic doctors I’ve ever met. I truly couldn’t be happier to have found them.",
      rating: 5,
    },
    {
      name: "Luisa Santos",
      location: "Pembroke Pines Office",
      text: "I have never had such a great experience with doctor before I met Dr. Guadagna. He follows up with you after blood results, his staff is amazing and so caring and professional. I am so lucky to have this staff and Dr. Guadagna as my primary doctor. Highly recommend.",
      rating: 5,
    },
    {
      name: "Dina Dolan",
      location: "Davie Manor Offices",
      text: "Dr Sharon is simply wonderful. It has taken me years literally to find a doctor that listens and doesn't just want to push pills on me or just say things like they're reciting a script. Thank goodness I found her. I really felt heard and cared for. I highly recommend her and this office.",
      rating: 5,
    },
    {
      name: "Rosa Vasquez",
      location: "Davie Office",
      text: "It was an excellent experience. The front staff were warm and welcoming, which is rare to find these days. Nurse Practitioner Sharon Sabaitue, ARNP, has outstanding bedside manners—she is personable and genuinely invested in listening to her patients to determine the best treatment plan. I highly recommend her!",
      rating: 5,
    },
    {
      name: "Adriana Waldman",
      location: "Plantation Office",
      text: "I Love my new doctor Ramon B! What a great staff! The kindness starts with the smile and greetings at the reception. When you are ready to leave again your experience is kind and professional. Thanks a lot!! God bless you all!",
      rating: 5,
    },
    {
      name: "Berta Guillen",
      location: "Johnson Office",
      text: "Dr William Peña is wonderful, very knowledgeable and caring. He explains everything in detail and is extremely thorough. Looks at your last labs and compares it to the current. He listens and is compassionate to what you have to say. Been going to him for years and will travel to be able to be seen by him. 💖",
      rating: 5,
    },
    {
      name: "orly orlandi",
      location: "Pembroke Pines",
      text: "Dr. Ruth as always was very professional and very thorough. She had addressed my concerns and needs appropriately. Nicole was very skillful with drawing my blood and giving me my vaccination. The receptionist was also courteous and professional. Thank you very much for providing me with best care as always. God bless!!!",
      rating: 5,
    },
  ];

  // Split testimonials into 3 columns
  const col1 = [testimonials[0], testimonials[3], testimonials[6]];
  const col2 = [testimonials[1], testimonials[4], testimonials[7]];
  const col3 = [testimonials[2], testimonials[5], testimonials[8]];

  const renderTestimonial = (testimonial: any) => (
    <div
      key={testimonial.name}
      className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl relative group hover:bg-white/10 transition-colors duration-300 mb-8"
    >
      <Quote className="absolute top-8 right-8 w-12 h-12 text-white/5 group-hover:text-accent-500/20 transition-colors duration-300" />

      <div className="flex items-center gap-1 text-accent-400 mb-6">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-current" />
        ))}
      </div>

      <p className="text-white/80 leading-relaxed mb-8 relative z-10 text-base italic font-serif">
        "{testimonial.text}"
      </p>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400 font-bold text-lg">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-white">{testimonial.name}</p>
          <p className="text-sm text-white/60">
            {testimonial.location} Patient
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-24 bg-transparent text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 reveal-up">
          <h2 className="text-sm font-bold tracking-widest text-accent-400 uppercase mb-4">
            Patient Stories
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif font-medium mb-6">
            Hear From Our Community
          </h3>
          <p className="text-lg text-white/70 reveal-text-scrub">
            We are proud to serve the Broward and Dade County community and are
            honored by the trust our patients place in us.
          </p>
        </div>

        <div className="parallax-grid-wrapper grid md:grid-cols-3 gap-8">
          <div className="parallax-column space-y-8" data-speed="0.8">
            {col1.map(renderTestimonial)}
          </div>
          <div className="parallax-column space-y-8" data-speed="0.5">
            {col2.map(renderTestimonial)}
          </div>
          <div className="parallax-column space-y-8" data-speed="1.2">
            {col3.map(renderTestimonial)}
          </div>
        </div>
      </div>
    </section>
  );
}
