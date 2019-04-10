const axios = require("axios");
const cheerio = require("cheerio");

const { getDaysOpen, isToday } = require("./helper");

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

  let weekDaysOpen = $(".vendor-delivery-times > li")
    .text()
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 9);

  // console.log(weekDaysOpen);
  const daysOpen = getDaysOpen(weekDaysOpen);
  menu["daysOpen"] = daysOpen;

  // console.log(menu);
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

function cleanItems(category) {
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

function stripRanchoRelaxoItems(restaurant) {
  let categories = restaurant.categories.filter(
    category => !category.title.startsWith("BYOB")
  );

  categories = categories.filter(cleanItems);
  restaurant.categories = categories;
  return restaurant;
}
