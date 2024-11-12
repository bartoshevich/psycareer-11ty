const CleanCSS = require("clean-css");
const htmlMinifier = require('html-minifier-terser');
const { DateTime } = require("luxon");
const dateFilter = require("nunjucks-date-filter");

module.exports = function (eleventyConfig) {
  // Копируем статические файлы
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/favicons");
  eleventyConfig.addPassthroughCopy("src/assets/scripts/index.js");
  eleventyConfig.addPassthroughCopy("/src/service-workers.js");
  eleventyConfig.addPassthroughCopy("src/_headers");
  eleventyConfig.addPassthroughCopy("src/_redirects");

  eleventyConfig.ignores.add("src/_drafts/**/*");

  // Фильтры для дат
  eleventyConfig.addNunjucksFilter("dateToFormat", function (date) {
    return DateTime.fromJSDate(date, { zone: "utc" })
      .setLocale("ru")
      .toLocaleString(DateTime.DATE_FULL);
  });

  eleventyConfig.addFilter("dateModified", (dateObj) => {
    if (!dateObj) {
      return "Invalid DateTime";
    }
    return DateTime.fromISO(dateObj, { zone: 'utc' }).toFormat("yyyy-LL-dd'T'HH:mm:ssZZ");
  });

  // Фильтры для работы с массивами
  eleventyConfig.addFilter('find', function(array, predicate) {
    if (!array || !Array.isArray(array)) return null;
    return array.find(predicate);
  });

  eleventyConfig.addFilter('filter', function(array, predicate) {
    if (!array || !Array.isArray(array)) return [];
    return array.filter(predicate);
  });

  eleventyConfig.addFilter('some', function(array, predicate) {
    if (!array || !Array.isArray(array)) return false;
    return array.some(predicate);
  });

  eleventyConfig.addFilter('slice', function(array, start, end) {
    if (!array || !Array.isArray(array)) return [];
    return array.slice(start, end);
  });

  eleventyConfig.addFilter("includes", function(array, value) {
    return array && Array.isArray(array) && array.includes(value);
  });

  eleventyConfig.addFilter('first', array => {
    if (!array || !array.length) return null;
    return array[0];
  });
  
  eleventyConfig.addFilter('push', (array, item) => {
    array.push(item);
    return array;
  });

  // Фильтр для связанных статей
  eleventyConfig.addFilter('relatedArticles', function(allPosts, currentPage, limit = 3) {
    if (!currentPage || !currentPage.data || !currentPage.data.tags || !Array.isArray(currentPage.data.tags)) {
      return [];
    }

    const currentTags = currentPage.data.tags;
    
    return allPosts
      .filter(post => {
        if (!post || !post.data || post.url === currentPage.url) return false;
        
        const postTags = post.data.tags;
        if (!postTags || !Array.isArray(postTags)) return false;
        
        return postTags.some(tag => currentTags.includes(tag));
      })
      .slice(0, limit);
  });

  // Коллекции
  eleventyConfig.addCollection('articles', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/posts/*.md').sort(function(a, b) {
      return b.date - a.date; 
    });
  });

  eleventyConfig.addCollection('psySalesArticles', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/posts/*.md').filter(function(item) {
      return item.data.tags && item.data.tags.includes('psy-продажи');
    });
  });

  eleventyConfig.addCollection('psyPositionArticles', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/posts/*.md').filter(function(item) {
      return item.data.tags && item.data.tags.includes('psy-позиционирование');
    });
  });

  eleventyConfig.addCollection('psyAdvArticles', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/posts/*.md').filter(function(item) {
      return item.data.tags && item.data.tags.includes('psy-реклама');
    });
  });

  eleventyConfig.addCollection('psyMoneyArticles', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/posts/*.md').filter(function(item) {
      return item.data.tags && item.data.tags.includes('psy-деньги');
    });
  });

  eleventyConfig.addCollection('psyNetArticles', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/posts/*.md').filter(function(item) {
      return item.data.tags && item.data.tags.includes('psy-интернет');
    });
  });

  eleventyConfig.addCollection('psyIdeaArticles', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/posts/*.md').filter(function(item) {
      return item.data.tags && item.data.tags.includes('psy-идеи');
    });
  });

  eleventyConfig.addCollection('psyEduArticles', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/posts/*.md').filter(function(item) {
      return item.data.tags && item.data.tags.includes('psy-образование');
    });
  });

  eleventyConfig.addCollection('psyGuruArticles', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/posts/*.md').filter(function(item) {
      return item.data.tags && item.data.tags.includes('psy-общее');
    });
  });

  // Минификация HTML
  eleventyConfig.addTransform('htmlmin', function(content, outputPath) {
    if (outputPath && outputPath.endsWith('.html')) {
      let minified = htmlMinifier.minify(content, {
        collapseWhitespace: true,
        conservativeCollapse: true,
        preserveLineBreaks: false,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true
      });
      return minified;
    }
    return content;
  });

  // Наблюдение за изменениями в папке assets
  eleventyConfig.addWatchTarget("src/assets/");

  // Настройка BrowserSync
  eleventyConfig.setBrowserSyncConfig({
    files: ["public/**/*.*"],
  });

  // Глобальный permalink
  eleventyConfig.addGlobalData("permalink", () => {
    return (data) =>
      `${data.page.filePathStem}.${data.page.outputFileExtension}`;
  });

  // Фильтры для URL
  eleventyConfig.addFilter("stripHtmlExtension", (url) => {
    return url.replace(/\.html$/, "");
  });

  eleventyConfig.addFilter("cleanUrl", (url) => {
    return url.replace(/\/index\.html$/, "/");
  });

  // Фильтр для минификации CSS
  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Фильтр для форматирования дат
  eleventyConfig.addFilter("date", (dateObj, format = "yyyy-LL-dd'T'HH:mm:ssZZ") => {
    return DateTime.fromJSDate(new Date(dateObj), { zone: 'utc' }).toFormat(format);
  });

  eleventyConfig.setWatchThrottleWaitTime(100); 
  eleventyConfig.setWatchJavaScriptDependencies(false);

  eleventyConfig.setTemplateFormats([
    "md",
    "html",
    "njk", 
    "liquid"
  ]);

  eleventyConfig.addCollection("pages", function(collection) {
    return collection.getAll().map(item => {
      item.url = item.url.replace(/\/index\.html$/, "/");
      return item;
    });
  });

  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
      output: "public",
    },
  };
};