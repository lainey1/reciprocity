import { useEffect } from "react";
import Typed from "typed.js";

import landing_image from "../../../public/Landing_Page.png";
import "./LandingPage.css";

const LandingPage = () => {
  useEffect(() => {
    // Initialize Typed.js
    const options = {
      strings: [
        "a Moroccan spice market",
        "Sunday brunches",
        "great, great, great grandma",
        "our first apartment",
        "Greece",
        "papa",
        "holiday dinners",
        "Italian neighbor",
        "grandpa's secret recipe vault",
        "Mexico",
        "Uncle Joe's BBQ nights",
        "my mother-in-law",
        "my trip to Japan",
        "our wedding",
        "Aunt Sally",
        "my brother",
        "our family reunions",
        "a café in Paris",
        "my dad's campfire stories",
        "my sister-in-law",
        "the recipe swap from 1995",
        "that rainy camping trip",
        "my college roommate",
        "my imaginary friend",
        "the cookbook that fell apart",
        "vacation with the cousins",
        "France",
        "my godmother",
        "my cousin from the South",
        "the bakery down the street",
        "my childhood friend",
        "the streets of Bangkok",
        "my best friend",
        "my partner's parents",
        "New Orleans",
        "my grandma's kitchen",
      ],
      typeSpeed: 50,
      backSpeed: 20,
      backDelay: 1000,
      startDelay: 500,
      loop: true,
    };

    const typed = new Typed(".typed", options);

    return () => {
      typed.destroy(); // Cleanup on component unmount
    };
  }, []);

  return (
    <div id="landing-page-container">
      <span id="site-greeting">
        <h2 id="section-header">Recipes from</h2>
        <span id="typed-container">
          <h2 id="typed">
            &nbsp;<span className="typed"></span>
          </h2>
        </span>
      </span>

      <br />

      <div id="landing-image-container">
        <img
          src={landing_image}
          alt="Reciprocity - Where Recipes Build Bonds and Memories Last Forever"
          id="landing-page-image"
        />
      </div>
    </div>
  );
};

export default LandingPage;
