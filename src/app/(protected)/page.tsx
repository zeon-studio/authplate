import { getListPage } from "@/lib/contentParser";
import Pricing from "@/partials/Pricing";
import { Pricing as PricingType } from "@/types";

const Home = async () => {
  // const session = (await auth()) || {};
  const { frontmatter: pricing } = getListPage<PricingType>("pricing/index.md");

  return <Pricing {...pricing} />;
};

export default Home;
