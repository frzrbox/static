# Coolstart

Coolstart is an [11ty](https://11ty.dev/) starter built with [Snowpack](https://www.snowpack.dev/), deployed on [Netlify](https://www.netlify.com/) and has the option to be managed with [Prismic](https://prismic.io/).

## Get Started

Default Template

`npm init coolstart <project-name>`

Prismic Template

`npm init coolstart --template prismic <project-name>`

### Run Locally

`npm start`

### Build

`npm run build`

## Features

- Typescript
- Babel
- SASS/SCSS
- Image Optimization
- Integration with Prismic (Works out of the box if starting from the Prismic template, otherwise you will have to manually set it up)

## Contents

- [Meta Info](#meta-info)
- [Styling](#styling)
- [Typescript](#typescript)
- [Image optimization](#image-optimization)
- [Prismic](#prismic)
- [Deployment](#deployment)
- [Gotchas](#gotchas)

## Meta Info

By default you can globally set meta information in `src/_data/site.json`. You can also customize per page by editing the `metaDesc` and `title` values in the pages frontmatter.

**Example**:

```yaml
---
title: About
metaDesc: This is the meta description for the about page.
---
```

## Styling

Cool start supports SASS/SCSS out of the box. Files in the `src/scss` folder will be passed to `dist/css`. You can include specific stylesheets by adding them to the `pageStylesheets` property in the frontmatter or directly in the template. Any changes to configuration can be made in the `snowpack.config.js` file.

Set in frontmatter: `src/post/post-one.md`

```yaml
# Make sure to use relative paths: the css folder is located in the root of dist
# Must be wrapped in an array even if there is only one stylesheet
pageStylesheets: ['../css/styles.css']
```

Set in layout: `src/_includes/layouts/about.njk`

```njk
{# Make sure to use relative paths: the css folder is located in the root of dist #}
{% set pageStylesheets = ['css/styles.css', 'css/about.css'] %}
```

## Typescript

All files located in `src/js` support typescript out of the box. It also uses babel to transpile all code, so modern features like `import / export` and `async / await` can be used. The compiled files will be located in `dist/js`. If you need further customization you can edit the babel cli in `snowpack.conifg.js`.

Similarly to the stylesheets, you can add multiple scripts to a page by specifying it in the frontmatter or layout itself.

Set in frontmatter: `src/post/post-one.md`

```yaml
# Make sure to use relative paths: the js folder is located in the root of dist
# Must be wrapped in an array even if there is only one script
pageScripts: ['../js/scripts.js']
```

Set in layout: `src/_includes/layouts/about.njk`

```njk
{# Make sure to use relative paths: the js folder is located in the root of dist #}
{% set pageStylesheets = ['js/scripts.js'] %}
```

## Image Optimization

Coolstart uses [eleventy-img](https://www.11ty.dev/docs/plugins/image/) and a nunjucks shortcode name `picture` to generate responsive images.

**Note:** The images will be all stored in the `img` folder in the root directory so name relative paths accordingly, configuration can also be changed in `.eleventy.js`

The shortcude is structured like this:

```njk
{% picture src alt className %}
```

- **src**: The path to the image
- **alt**: Alt text for the element (Note: the build will fail if no alt is added)
- **className** (optional): Classes that should be added to the picture element by default all elements will recieve the class `responsive_image`

**Example**:

```yaml
---
image:
  url: src/img/my-cool-image.jpg
  alt: This is a really cool image
---
```

```njk
{% picture image.url, image.alt, 'cool_image width__100' %}
```

## Prismic

If you start from the Prismic template, Coolstart will come with a configuration file (`prismic.js`), a link resolver (`linkResolver.js`), a HTML serializer (`hmtlSerializer.js`) and handy shortcodes that can be customized in `.eleventy.js`.

### Conifguration

The configuration file is `prismic.js`, it exports a `client` that can be used to query the api within `src/_data`. To setup the configuration you will need to add the values for `PRISMIC_ENDPOINT` and `PRISMIC_ACCESS_TOKEN` to the `.env` file.

Useful links

- [Link Resolver](https://prismic.io/docs/technologies/link-resolver-javascript)
- [HTML Serializer](https://prismic.io/docs/technologies/html-serializer-javascript)
- [Querying Data With Prismic](https://prismic.io/docs/technologies/how-to-query-the-api-javascript)

### Link Resolver

Coolstart automatically generates a `link` shortcode that uses options from `linkResovler.js` to generate an `a` tag.

**Example**:

```njk
{% for item in navigation %}
  <li>
      {# shortcode link content classNames target #}
      {% link item.link, item.label, 'nav_link', item.link.target %}
  </li>
{% endfor %}
```

### HTML Serializer

For parts of the site that need rich text, Coolstart has a `richText` shortcode that will generate rich text based of options specified in the `htmlSerializer.js` and the `linkResolver.js`.

**Example**:

```njk
{% set post_content = post.data.content %}
{% richText post_content %}
```

### Querying

All queries will be done within the `src/_data` directory using the `client` from our configuration file. Documentaion on [querying data from Prismic can be found here](https://prismic.io/docs/technologies/how-to-query-the-api-javascript).

**Example**:

`src/_data/header`

```js
const { client } = require('../../prismic');

module.exports = async () => {
	const header = await client.getSingle('header');
	return header;
};
```

`header.njk`

```njk
{% set navigation = header.data.navigation %}

<header>
    <h1 class="ta__center"><a href="/">Site Name</a></h1>

    <nav>
        <ul>
            {% for item in navigation %}
                <li>
                    {# shortcode link content classNames target #}
                    {% link item.link, item.label, 'nav_link', item.link.target %}
                </li>
            {% endfor %}
        </ul>
    </nav>
</header>
```

## Deployment

**Note:** While this site can be deployed anyhwere, to get the best out of Coolstart we reccomend deploying on [Netlify](https://www.netlify.com/).

## Gotchas

**Supages not updating when changes are made to the content**
As of right now HMR will only work with routes that have a trailing slash. If you are editing the content but don't see the changes reflected on the live site, add a trailing slash to the route as will as link.

`/about to /about/`

The trailing slashes can be removed by Netlify by following the [steps](https://answers.netlify.com/t/support-guide-how-can-i-alter-trailing-slash-behaviour-in-my-urls-will-enabling-pretty-urls-help/31191)

## Thanks

This project was inspired by lessons learned from:

- [Andy Bell's 11ty Course](https://piccalil.li/course/learn-eleventy-from-scratch/)
- [Levelup Tutorials Snowpack & ESM](https://www.leveluptutorials.com/tutorials/esm-and-snowpack)
- [MDX Deck](https://github.com/jxnblk/mdx-deck)
