import  HeroChakra  from "./sections/Hero/HeroChakra";
import  HeroMui  from "./sections/Hero/HeroMui";
import  HeroAntd  from "./sections/Hero/HeroAntd";
import  {HeroTailwind}  from "./sections/Hero/HeroTailwind";
import HeroAcernity from "./sections/Hero/HeroAcernity";

import  FeaturesChakra  from "./sections/Features/FeaturesChakra";
import  FeaturesMui  from "./sections/Features/FeaturesMui";
import  FeaturesAntd  from "./sections/Features/FeaturesAntd";
import  FeaturesTailwind  from "./sections/Features/FeaturesTailwind";

import  FooterChakra  from "./sections/Footer/FooterChakra";
import  FooterMui  from "./sections/Footer/FooterMui";
import  FooterAntd  from "./sections/Footer/FooterAntd";
import  FooterTailwind  from "./sections/Footer/FooterTailwind";

export const COMPONENTS = {
  Hero: {
    Chakra: HeroChakra,
    Mui: HeroMui,
    Antd: HeroAntd,
    Tailwind: HeroTailwind,
    Acernity: HeroAcernity,
  },
  Features: {
    Chakra: FeaturesChakra,
    Mui: FeaturesMui,
    Antd: FeaturesAntd,
    Tailwind: FeaturesTailwind,
  },
  Footer: {
    Chakra: FooterChakra,
    Mui: FooterMui,
    Antd: FooterAntd,
    Tailwind: FooterTailwind,
  }
};