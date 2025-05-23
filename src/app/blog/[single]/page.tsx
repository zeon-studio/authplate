import BlogCard from "@/components/BlogCard";
import Share from "@/components/Share";
import config from "@/config/config.json";
import ImageFallback from "@/helpers/ImageFallback";
import MDXContent from "@/helpers/MDXContent";
import { getSinglePage } from "@/lib/contentParser";
import dateFormat from "@/lib/utils/dateFormat";
import similarItems from "@/lib/utils/similarItems";
import { humanize, markdownify, slugify } from "@/lib/utils/textConverter";
import SeoMeta from "@/partials/SeoMeta";
import { Post } from "@/types";
import { CircleUser, Clock, Folder } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const { blog_folder } = config.settings;

// remove dynamicParams
export const dynamicParams = false;

// generate static params
export const generateStaticParams: () => { single: string }[] = () => {
  const posts: Post[] = getSinglePage(blog_folder);

  const paths = posts.map((post) => ({
    single: post.slug!,
  }));

  return paths;
};

const PostSingle = async ({
  params,
}: {
  params: Promise<{ single: string }>;
}) => {
  const { single } = await params;
  const posts: Post[] = getSinglePage(blog_folder);
  const post = posts.filter((page) => page.slug === single)[0];

  if (!post) {
    return notFound();
  }

  const { frontmatter, content } = post;
  const {
    title,
    meta_title,
    description,
    image,
    author,
    categories,
    date,
    tags,
  } = frontmatter;
  const similarPosts = similarItems(post, posts, post.slug!);

  return (
    <>
      <SeoMeta
        title={title}
        meta_title={meta_title}
        description={description}
        image={image}
      />
      <section className="section pt-7">
        <div className="container">
          <div className="row justify-center">
            <article className="lg:col-10">
              {image && (
                <div className="mb-10">
                  <ImageFallback
                    src={image}
                    height={500}
                    width={1200}
                    alt={title}
                    className="w-full rounded"
                  />
                </div>
              )}
              <h1
                dangerouslySetInnerHTML={markdownify(title)}
                className="h2 mb-4"
              />
              <ul className="mb-4">
                <li className="mr-4 inline-block">
                  <a href={`/authors/${slugify(author)}`}>
                    <CircleUser className={"-mt-1 mr-2 inline-block"} />
                    {humanize(author)}
                  </a>
                </li>
                <li className="mr-4 inline-block">
                  <Folder className={"-mt-1 mr-2 inline-block"} />
                  {categories?.map((category: string, index: number) => (
                    <Link
                      key={category}
                      href={`/categories/${slugify(category)}`}
                    >
                      {humanize(category)}
                      {index !== categories.length - 1 && ", "}
                    </Link>
                  ))}
                </li>
                {date && (
                  <li className="mr-4 inline-block">
                    <Clock className="-mt-1 mr-2 inline-block" />
                    {dateFormat(date)}
                  </li>
                )}
              </ul>
              <div className="content mb-10">
                <MDXContent content={content} />
              </div>
              <div className="row items-start justify-between">
                <div className="mb-10 flex items-center lg:col-5 lg:mb-0">
                  <h5 className="mr-3">Tags :</h5>
                  <ul>
                    {tags?.map((tag: string) => (
                      <li key={tag} className="inline-block">
                        <Link
                          className="m-1 block rounded bg-light px-3 py-1 hover:bg-primary hover:text-white   "
                          href={`/tags/${slugify(tag)}`}
                        >
                          {humanize(tag)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center lg:col-4">
                  <h5 className="mr-3">Share :</h5>
                  <Share
                    className="social-icons"
                    title={title}
                    description={description}
                    slug={post.slug!}
                  />
                </div>
              </div>
            </article>
          </div>

          {/* <!-- Related posts --> */}
          <div className="section pb-0">
            <h2 className="h3 mb-12 text-center">Related Posts</h2>
            <div className="row justify-center">
              {similarPosts.map((post) => (
                <div key={post.slug} className="lg:col-4 mb-7">
                  <BlogCard data={post} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PostSingle;
