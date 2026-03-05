"use client";

import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Pricing from "@/components/sections/Pricing";
import ProjectsShowcase from "@/components/sections/ProjectsShowcase";
import Skills from "@/components/sections/Skills";
import Process from "@/components/sections/Process";
import Experience from "@/components/sections/Experience";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Services />
        <Pricing />
        <ProjectsShowcase />
        <Skills />
        <Process />
        <Experience />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
