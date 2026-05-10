import { motion } from 'framer-motion';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center"
      >
        <span className="px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-semibold mb-6 inline-block">
          Our Story
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">
          Redefining Premium E-Commerce
        </h1>
        <div className="space-y-6 text-slate-400 text-lg leading-relaxed text-left">
          <p>
            Welcome to SkylineShop, where quality meets convenience. Founded with a vision to
            provide a curated selection of premium products, we bridge the gap between luxury and
            everyday life.
          </p>
          <p>
            Our microservices-based platform ensures lightning-fast performance, high availability,
            and a secure shopping experience. Every product in our catalog is carefully selected to
            meet our rigorous standards for quality and design.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 text-center">
            <div className="p-6 bg-slate-900 border border-white/5 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-2">10k+</h3>
              <p className="text-sm">Happy Customers</p>
            </div>
            <div className="p-6 bg-slate-900 border border-white/5 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-2">24/7</h3>
              <p className="text-sm">Premium Support</p>
            </div>
            <div className="p-6 bg-slate-900 border border-white/5 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-2">100%</h3>
              <p className="text-sm">Secure Checkout</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
