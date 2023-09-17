import Head from "next/head";
import { useRouter } from "next/router";

// !STARTERCONF Change these default meta
const defaultMeta = {
  title: "Snapshare",
  siteName: "Snapshare",
  description:
    "Heaven for memers. Earn money by publishing your memes. Find the most hilarious memes on the internet. See you there!",
  // "The best platform for meme lovers. Publish your memes and earn rewards in cash. Grow your audience and become popular for your memes. Find the best memes on internet. Join the heaven of memers right f'n now!",
  /** Without additional '/' on the end, e.g. https://theodorusclarence.com */
  type: "website",
  robots: "follow, index",
  /**
   * No need to be filled, will be populated with openGraph function
   * If you wish to use a normal image, just specify the path below
   */
};

type SeoProps = {
  date?: string;
  templateTitle?: string;
  singlePostData: any;
} & Partial<typeof defaultMeta>;

export default function PostPageSeo(props: SeoProps) {
  const router = useRouter();
  const meta = {
    ...defaultMeta,
    ...props,
  };
  meta["title"] = props.templateTitle
    ? `${props.templateTitle} | ${meta.siteName}`
    : meta.title;

  // Use siteName if there is templateTitle
  // but show full title if there is none
  // !STARTERCONF Follow config for opengraph, by deploying one on https://github.com/theodorusclarence/og
  // ? Uncomment code below if you want to use default open graph
  // meta['image'] = openGraph({
  //   description: meta.description,
  //   siteName: props.templateTitle ? meta.siteName : meta.title,
  //   templateTitle: props.templateTitle,
  // });
  console.log("${meta.url}", `${meta.url}${router.asPath}`);
  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="robots" content={meta.robots} />
      <meta
        content={
          meta?.singlePostData?.description
            ? meta?.singlePostData?.description
            : meta.description || ""
        }
        name="description"
      />
      <meta property="og:url" content={`${meta.url}${router.asPath}`} />
      <link rel="canonical" href={`${meta.url}${router.asPath}`} />
      {/* Open Graph */}
      <meta property="og:type" content={meta.type} />
      <meta property="og:site_name" content={meta.siteName} />
      <meta
        property="og:description"
        content={
          meta?.singlePostData?.description
            ? meta?.singlePostData?.description
            : meta.description || ""
        }
      />
      <meta
        property="og:title"
        content={meta?.singlePostData?.user?.user_handle}
      />
      <meta
        name="image"
        property="og:image"
        content={`${meta?.singlePostData?.media?.url}`}
      />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={meta.siteName} />
      <meta
        name="twitter:title"
        content={meta?.singlePostData?.user?.user_handle}
      />
      <meta
        name="twitter:description"
        content={
          meta?.singlePostData?.description
            ? meta?.singlePostData?.description
            : meta.description || ""
        }
      />
      <meta
        name="twitter:image"
        content={`${meta?.singlePostData?.media?.url}`}
      />
      {meta.date && (
        <>
          <meta property="article:published_time" content={meta.date} />
          <meta
            name="publish_date"
            property="og:publish_date"
            content={meta.date}
          />
          <meta
            name="author"
            property="article:author"
            content="Theodorus Clarence"
          />
        </>
      )}

      {/* Favicons */}
      {favicons.map((linkProps) => (
        <link key={linkProps.href} {...linkProps} />
      ))}
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta
        name="msapplication-TileImage"
        content="https://memsake1.s3.ap-south-1.amazonaws.com/logo_icon.png"
      />
      <meta name="theme-color" content="#ffffff" />
    </Head>
  );
}

type Favicons = {
  rel: string;
  href: string;
  sizes?: string;
  type?: string;
};

// !STARTERCONF this is the default favicon, you can generate your own from https://www.favicon-generator.org/ then replace the whole /public/favicon folder
const favicons: Array<Favicons> = [
  {
    rel: "apple-touch-icon",
    sizes: "57x57",
    href: "/favicon/apple-icon-57x57.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "60x60",
    href: "/favicon/apple-icon-60x60.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "72x72",
    href: "/favicon/apple-icon-72x72.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "76x76",
    href: "/favicon/apple-icon-76x76.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "114x114",
    href: "/favicon/apple-icon-114x114.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "120x120",
    href: "/favicon/apple-icon-120x120.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "144x144",
    href: "/favicon/apple-icon-144x144.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "152x152",
    href: "/favicon/apple-icon-152x152.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/favicon/apple-icon-180x180.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "192x192",
    href: "/favicon/android-icon-192x192.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "96x96",
    href: "/favicon/favicon-96x96.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicon/favicon-16x16.png",
  },
  { rel: "manifest", href: "/favicon/site.webmanifest" },

  // {
  //   rel: "manifest",
  //   href: "/favicon/manifest.json",
  // },
];
