import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

function Home() {
  return (
    <div className="w-full text-gray-100">
      {/* HERO */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-amber-500/20 blur-[160px] rounded-full top-[-150px]"></div>

        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl font-extrabold relative z-10"
        >
          Welcome to{" "}
          <span className="bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent">
            SoGetkey
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="mt-5 max-w-xl text-gray-400 text-lg relative z-10"
        >
          AI-powered smart deal discovery platform where buyers save money,
          sellers earn rewards, and admins ensure quality.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 flex gap-5 relative z-10"
        >
          <a
            href="#buyer"
            className="px-6 py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition"
          >
            Shop & Save
          </a>

          <a
            href="#seller"
            className="px-6 py-3 rounded-xl border border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black transition"
          >
            Sell Coupons
          </a>
        </motion.div>
      </section>

      {/* TRUSTED PLATFORMS */}
      <section className="py-10 bg-[#0b0f1a] border-y border-[#1f2937]">
        <h2 className="text-center text-lg text-gray-400 mb-6">
          Trusted Platforms
        </h2>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={4}
          loop={true}
          autoplay={{ delay: 2000 }}
          breakpoints={{
            320: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {[
            "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
            "https://upload.wikimedia.org/wikipedia/commons/1/1b/Flipkart_logo.png",
            "https://upload.wikimedia.org/wikipedia/commons/6/69/Blinkit-yellow-app-icon.svg",
            "https://upload.wikimedia.org/wikipedia/commons/3/3f/Meesho_logo.svg",
          ].map((logo, i) => (
            <SwiperSlide key={i}>
              <div className="flex justify-center items-center h-16">
                <img
                  src={logo}
                  alt="platform"
                  className="h-10 object-contain opacity-80 hover:opacity-100 transition"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-amber-400 mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Search Products",
                desc: "Find products across trusted platforms instantly.",
              },
              {
                title: "Apply Coupons",
                desc: "Unlock verified discounts and maximize savings.",
              },
              {
                title: "Earn Rewards",
                desc: "Sellers earn rewards when buyers use their coupons.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.04 }}
                className="p-6 border border-[#1f2937] rounded-2xl bg-[#0b0f1a] hover:border-amber-500 transition"
              >
                <h3 className="text-lg font-semibold mb-3 text-gray-100">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BUYER */}
      <section id="buyer" className="py-16 px-6 bg-[#0b0f1a] text-center">
        <h2 className="text-2xl font-bold text-emerald-400">For Buyers</h2>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto">
          Discover best deals, apply coupons, and track your savings.
        </p>

        <Link
          to="/register"
          className="inline-block mt-6 px-6 py-3 bg-emerald-500 text-black rounded-xl font-semibold hover:bg-emerald-400 transition"
        >
          Start Saving
        </Link>
      </section>

      {/* SELLER */}
      <section id="seller" className="py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-orange-400">For Sellers</h2>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto">
          Upload coupons, track approvals, and earn provider rewards.
        </p>

        <Link
          to="/register"
          className="inline-block mt-6 px-6 py-3 bg-orange-500 text-black rounded-xl font-semibold hover:bg-orange-400 transition"
        >
          Upload Coupons
        </Link>
      </section>

      {/* FOOTER */}
      <section className="py-6 text-center text-gray-500 text-sm border-t border-[#1f2937]">
        © {new Date().getFullYear()} SoGetkey. All rights reserved.
      </section>
    </div>
  );
}

export default Home;
