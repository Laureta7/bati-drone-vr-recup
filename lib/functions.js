export function sortDatesDescending(dates) {
  return dates.sort((a, b) => {
    const aYear = a.slice(6);
    const bYear = b.slice(6);
    if (aYear !== bYear) {
      return bYear.localeCompare(aYear);
    }

    const aMonth = a.slice(3, 5);
    const bMonth = b.slice(3, 5);
    if (aMonth !== bMonth) {
      return bMonth.localeCompare(aMonth);
    }

    const aDay = a.slice(0, 2);
    const bDay = b.slice(0, 2);
    return bDay.localeCompare(aDay);
  });
}
