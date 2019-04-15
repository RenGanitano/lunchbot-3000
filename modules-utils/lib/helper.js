const dateFns = require("date-fns");

//ids are based on values returned from getDay() js method
const daysOfWeek = [
  { short: "Mon", long: "Monday", id: 1 },
  { short: "Tue", long: "Tuesday", id: 2 },
  { short: "Wed", long: "Wednesday", id: 3 },
  { short: "Thu", long: "Thursday", id: 4 },
  { short: "Fri", long: "Friday", id: 5 },
  { short: "Sat", long: "Saturday", id: 6 },
  { short: "Sun", long: "Sunday", id: 0 }
];

exports.isToday = () => {
  return dateFns.isToday(new Date());
};

//parses string such as "Mon - Fri" and returns array of days open, in long format.
exports.getDaysOpen = dateRange => {
  // matches either "Mon-Fri" or "Mon - Fri"
  const dates = dateRange.split(/s?-s?/);

  //trim excess whitespace before finding index
  const startIndex = daysOfWeek.findIndex(day => day.short == dates[0].trim());
  const endIndex = daysOfWeek.findIndex(day => day.short == dates[1].trim());

  const daysOpen = [];
  for (let i = startIndex; i <= endIndex; i++) {
    daysOpen.push(daysOfWeek[i].long);
  }
  return daysOpen;
};

exports.getStringDate = id => {
  const dayOfWeek = daysOfWeek.find(day => day.id == id);
  return dayOfWeek.long;
};

exports.getRandomIndex = (min, max) => {
  const rn = Math.floor(Math.random() * (max - min + 1)) + min;
  return rn;
};

exports.findOpenRestaurants = (restaurants, dayOfWeek) => {
  return restaurants.filter(restaurant =>
    restaurant.daysOpen.includes(dayOfWeek)
  );
};

exports.returnItemsForSuggestion = restaurants => {
  const items = [];
  restaurants.forEach(function(rest, index) {
    const catIndex = exports.getRandomIndex(0, rest.categories.length - 1);
    const cat = rest.categories[catIndex];
    const itemIndex = exports.getRandomIndex(
      0,
      rest.categories[catIndex].items.length - 1
    );

    let item = rest.categories[catIndex].items[itemIndex];
    item = `${item} from ${rest.name}`;
    items.push(item);
  });
  return items;
};
