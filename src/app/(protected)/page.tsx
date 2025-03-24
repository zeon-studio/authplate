import Pricing from "@/layouts/partials/Pricing";
import { getListPage } from "@/lib/contentParser";
import { Pricing as PricingType } from "@/types";

const Home = async () => {
  const { frontmatter: pricing } = getListPage<PricingType>("pricing/index.md");

  return <Pricing {...pricing} />;
};

export default Home;
