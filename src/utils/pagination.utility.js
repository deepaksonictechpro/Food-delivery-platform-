function getPagination(page = 1, limit = 10) {
  const currentPage = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;

  const offset = (currentPage - 1) * pageSize;

  return { limit: pageSize, offset, currentPage };
}

function getPagingData(data, page, limit) {
  const { count: totalItems, rows } = data;

  const currentPage = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;

  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    totalItems,
    totalPages,
    currentPage,
    data: rows,
  };
}

module.exports = { getPagination, getPagingData };