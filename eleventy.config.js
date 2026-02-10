const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addPassthroughCopy("public");

  // Copy images from posts/ to blog/ so they sit alongside post URLs
  eleventyConfig.addPassthroughCopy({
    "src/posts/**/*.{png,jpg,jpeg,gif,svg,webp}": "blog",
  });

  // Date filter: "10th Feb 2026" style
  eleventyConfig.addFilter("date", (dateObj) => {
    const d = new Date(dateObj);
    const day = d.getUTCDate();
    const suffix =
      day % 10 === 1 && day !== 11 ? "st" :
      day % 10 === 2 && day !== 12 ? "nd" :
      day % 10 === 3 && day !== 13 ? "rd" : "th";
    const month = d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
    return `${day}${suffix} ${month} ${d.getUTCFullYear()}`;
  });

  // Excerpt filter — first paragraph of content
  eleventyConfig.addFilter("excerpt", (content) => {
    if (!content) return "";
    const match = content.match(/<p>(.*?)<\/p>/s);
    return match ? match[1].replace(/<[^>]+>/g, "") : "";
  });

  // Auto-permalink for posts: strip numeric prefix, map to /blog/slug/
  eleventyConfig.addGlobalData("eleventyComputed.permalink", function () {
    return function (data) {
      if (data.permalink) return data.permalink;
      if (data.tags && data.tags.includes("posts")) {
        const slug = data.page.fileSlug.replace(/^\d+-/, "");
        return `/blog/${slug}/`;
      }
      return data.permalink;
    };
  });

  // Posts collection sorted by date descending
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi
      .getFilteredByTag("posts")
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
