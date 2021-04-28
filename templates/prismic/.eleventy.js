const Image = require("@11ty/eleventy-img");
const PrismicDOM = require("prismic-dom");
const htmlSerializer = require("./htmlSerializer");
const linkResolver = require("./linkResolver");

module.exports = (config) => {
  config.setTemplateFormats([
    // Templates:
    "html",
    "njk",
    "md",
    // Static Assets:
    "css",
    "jpeg",
    "jpg",
    "png",
    "svg",
    "woff",
    "woff2",
  ]);

  config.addPassthroughCopy("./src/fonts");
  config.addPassthroughCopy("./src/post");
  config.addWatchTarget("./src/");

  // 11ty Shortcodes

  // HTML Serializer Shortcode
  config.addNunjucksShortcode("richText", function (content) {
    return PrismicDOM.RichText.asHtml(content, linkResolver, htmlSerializer);
  });

  // Link Resovler Shortcode
  config.addNunjucksShortcode(
    "link",
    function (link, content, classNames = "", target = "_self") {
      const resolvedPath = linkResolver(link);
      return `<a class="prismic_link ${classNames}" href="${resolvedPath}" target="${target}">${content[0].text}</a>`;
    }
  );

  config.addNunjucksAsyncShortcode(
    "picture",

    async function (src, alt, className = "", sizes = "100vw") {
      if (alt === undefined) {
        // You bet we throw an error on missing alt (alt="" works okay)
        throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
      }
      let metadata = await Image(src, {
        widths: [300, 600, 900],
        formats: ["webp", "jpeg"],
        outputDir: "dist/img",
      });

      let lowsrc = metadata.jpeg[0];

      return `<picture class="[ responsive_image ] ${className}">
              ${Object.values(metadata)
                .map((imageFormat) => {
                  return `  <source type="image/${
                    imageFormat[0].format
                  }" srcset="${imageFormat
                    .map((entry) => entry.srcset)
                    .join(", ")}" sizes="${sizes}">`;
                })
                .join("\n")}        
              <img src="${lowsrc.url}" width="${lowsrc.width}" height="${
        lowsrc.height
      }" alt="${alt}">      
            </picture>`;
    }
  );

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};