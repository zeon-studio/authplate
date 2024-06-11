import config from "@/config/config.json";
import { getSinglePage } from "@/lib/contentParser";
import SeoMeta from "@/partials/SeoMeta";
import { Post } from "@/types";

const { blog_folder } = config.settings;

// Retrieve all articles
const posts: Post[] = getSinglePage(blog_folder);

// List of items to search in
const searchList = posts.map((item) => ({
  slug: item.slug!,
  frontmatter: item.frontmatter,
  content: item.content,
}));

const SearchPage = () => {
  return (
    <>
      <SeoMeta title={"Search"} />
    </>
  );
};

export default SearchPage;
