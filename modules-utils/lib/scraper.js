const axios = require("axios");
const cheerio = require("cheerio");

const { getDaysOpen, isToday, getDaysOpenArray } = require("./helper");

async function getHTML(url) {
  const { data: html } = await axios.get(url);
  return html;
}

exports.getMenuItemFromPigCameHome = async html => {
  //load up cheerio
  const $ = cheerio.load(html);
  const items = $("#block-yui_3_17_2_15_1479102197363_4481 h3 > strong");
  const menuItems = [];
  items.each(function(i, elem) {
    menuItems[i] = $(this).text();
  });
  return menuItems;
};

exports.getItemsFromFoodora = async html => {
  //load up cheerio
  const $ = cheerio.load(html);
  const restaurantTitle = $("div.vendor-info-main-headline.item > h1").text();
  const menu = { name: restaurantTitle, categories: [] };
  const headers = $(".dish-category-header");
  headers.each(function(h, elem) {
    const categoryTitle = $(this)
      .text()
      .trim();

    //if the category is sides, skip it
    if (categoryTitle == "Sides") return;

    //initialize empty category
    const category = { title: "", items: [] };
    category["title"] = categoryTitle;

    const arraySibling = $(this)
      .next()
      .find($(".dish-name"));

    arraySibling.each(function(s, element) {
      //get this categories individual items
      category["items"].push(
        $(this)
          .text()
          .trim()
      );
    });

    menu["categories"].push(category);
  });

  /*
 For this value->
 Mon - Wed 11:00 AM - 5:00 PM, 11:00 AM - 5:00 PM
 Thu 11: 00 AM - 2: 30 PM, 11: 00 AM - 2: 30 PM
 Fri, Sat 11: 00 AM - 5: 30 PM, 11: 00 AM - 5: 30 PM

 strips out the time value (e.g. 5:00), AM & PM and the - between them, to leave only "Mon-Wed, Thu, Sat" which are then split into their own arrays.
 */
  let days = $(".vendor-delivery-times > li")
    .text()
    .replace(/\d|:|(A|P)M - |(A|P)M/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .split(",");
  days = days.map(day => day.trim()).filter(day => day != "");

  const daysOpen = getDaysOpenArray(days);
  menu["daysOpen"] = daysOpen;
  return menu;
};

exports.getPigCameHomeMenu = async url => {
  const html = await getHTML(url);
  const pigMenu = await exports.getItemsFromFoodora(html);
  return pigMenu;
};

exports.getRanchoCameHomeMenu = async url => {
  const html = await getHTML(url);
  const ranchoMenu = await exports.getItemsFromFoodora(html);
  return stripRanchoRelaxoItems(ranchoMenu);
  return ranchoMenu;
};

exports.getBaguetteMenu = async url => {
  const html = await getHTML(url);
  const menu = await exports.getItemsFromFoodora(html);
  return stripBaguetteItems(menu);
  return menu;
};

//removes items such as "Choice of 3" and strips out extra values on items such as Fried Fish (3) to just be Fried Fish
function cleanItemsForRancho(category) {
  //filtering out items with "Choice of 2"
  let filteredItems = category.items.filter(item => !item.startsWith("Choice"));
  //removing the (3) from Famous Fried Fish (3)
  filteredItems = filteredItems.map(item => {
    item = item.slice(0, -4);
    return `${category.title} - ${item}`;
  });

  category.items = filteredItems;
  return category;
}

//strips out categories that start with BYOB
function stripRanchoRelaxoItems(restaurant) {
  let categories = restaurant.categories.filter(
    category => !category.title.startsWith("BYOB")
  );

  categories = categories.filter(cleanItemsForRancho);
  restaurant.categories = categories;
  return restaurant;
}

//removes menu items that we do not care about such as fruit salad and removes plurals from categories for example Baguettes should be Baguette
function cleanBaguetteItems(category) {
  const title = category.title.slice(0, -1);
  //filtering out items with "Choice of 2"
  let filteredItems = category.items.filter(item => !item.startsWith("Fruit"));
  //removing the (3) from Famous Fried Fish (3)
  filteredItems = filteredItems.map(item => {
    return `${title} - ${item}`;
  });

  category.items = filteredItems;
  return category;
}

//only selects categories that we care about like Baguettes and Salads
function stripBaguetteItems(restaurant) {
  let categories = restaurant.categories.filter(
    category =>
      category.title.startsWith("Baguettes") ||
      category.title.startsWith("Salads")
  );
  categories = categories.filter(cleanBaguetteItems);
  restaurant.categories = categories;
  return restaurant;
}
