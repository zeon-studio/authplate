import { slugify } from "@/lib/utils/textConverter";
import { TPost } from "@/types";

const taxonomyFilter = (posts: TPost[], name: string, key: any) =>
  posts.filter((post) =>
    //@ts-ignore
    post.frontmatter[name].map((name: string) => slugify(name)).includes(key),
  );

export default taxonomyFilter;
