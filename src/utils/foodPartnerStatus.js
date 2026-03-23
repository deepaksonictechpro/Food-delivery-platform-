function getFoodPartnerStatus(openingTime, closingTime) {
  if (!openingTime || !closingTime) return "CLOSED";

  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 8);

  if (currentTime >= openingTime && currentTime <= closingTime) {
    return "OPEN";
  }

  return "CLOSED";
}

module.exports = { getFoodPartnerStatus };