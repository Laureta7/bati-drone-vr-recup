/**
 *
 * @param {*} dates
 * @returns L'objet en ordre décroissant prends date format : 19-02-23 , split pour comparer
 */
export function sortObject(dates) {
  return Object.keys(dates)
    .sort((a, b) => {
      const aYear = a.slice(0, 2);
      const bYear = b.slice(0, 2);
      if (aYear !== bYear) {
        return bYear.localeCompare(aYear);
      }

      const aMonth = a.slice(3, 5);
      const bMonth = b.slice(3, 5);
      if (aMonth !== bMonth) {
        return bMonth.localeCompare(aMonth);
      }

      const aDay = a.slice(6);
      const bDay = b.slice(6);
      return bDay.localeCompare(aDay);
    })
    .reduce((obj, key) => {
      obj[key] = dates[key];
      return obj;
    }, {});
}
