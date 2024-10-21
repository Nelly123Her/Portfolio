import React from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const Hero = () => {
  const particlesInit = async (main) => {
    await loadFull(main); // Loads tsparticles full engine
  };

  const particlesOptions = {
    fpsLimit: 60,
    particles: {
      number: {
        value: 200, // High particle count for visibility
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#ffffff", // White particles
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.5, // Semi-transparent particles
      },
      size: {
        value: 3, // Medium-sized particles
        random: true,
      },
      move: {
        enable: true,
        speed: 2, // Slow movement for a relaxing effect
        direction: "none",
        random: true,
        straight: false,
        outMode: "bounce",
      },
    },
    detectRetina: true, // Optimized for retina displays
  };

  return (
    <div className="relative h-screen flex items-center justify-center">
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from via-[#141e30] to-[#243b55] opacity-90 z-0"></div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white">
          Welcome to My Portfolio
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-gray-300">
          A minimalistic design with particle effects
        </p>
        <a
          href="#projects"
          className="mt-8 inline-block bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-300 transition duration-300"
        >
          Explore Projects
        </a>
      </div>
    </div>
  );
};

export default Hero;