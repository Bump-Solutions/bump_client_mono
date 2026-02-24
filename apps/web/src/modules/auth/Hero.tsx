import { heroBackgrounds } from "@bump/assets";
import { ENUM } from "@bump/utils";

import { useMemo } from "react";
import { Link } from "react-router";

import Gallery from "./Gallery";

type FooterLink = {
  label: string;
  href: string;
};

const FOOTER_LINKS: FooterLink[] = [
  {
    label: "Alkalmazás",
    href: "",
  },
  {
    label: "Adatvédelem",
    href: "",
  },
  {
    label: "Feltételek",
    href: "",
  },
  {
    label: "Kapcsolat",
    href: "",
  },
];

const shuffleArray = (array: string[]): string[] => {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
};

const Hero = () => {
  const currentYear = new Date().getFullYear();

  const shuffledBackgrounds = useMemo(() => shuffleArray(heroBackgrounds), []);

  return (
    <div className='hero'>
      <Gallery images={shuffledBackgrounds} columns={9} />

      <div className='hero__wrapper'>
        <h1 className='hero__title'>{ENUM.BRAND.NAME}</h1>
        <p className='hero__subtitle'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
          repellat quam dicta at necessitatibus ipsa enim, consequatur
          dignissimos veniam reiciendis?
        </p>
        <footer className='hero__footer'>
          <h4>
            &copy;{currentYear}&ensp;<span>Magyarország</span>
          </h4>
          <div className='hero__links'>
            {FOOTER_LINKS.map((link, index) => (
              <Link key={index} to={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Hero;
