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

  // Date formatting filter
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // Short date for cards
  eleventyConfig.addFilter("shortDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  });

  // ISO date for machine-readable
  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return new Date(dateObj).toISOString();
  });

  // Excerpt filter — first paragraph of content
  eleventyConfig.addFilter("excerpt", (content) => {
    if (!content) return "";
    const match = content.match(/<p>(.*?)<\/p>/s);
    return match ? match[1].replace(/<[^>]+>/g, "") : "";
  });

  // Posts collection: grab all md files in posts/, sorted by date descending
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/posts/*.md")
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
