class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    let keyword = this.queryStr.keyword;
    let query = {};
    if (keyword) {
      query.$or = [
        { bikename: { $regex: keyword, $options: "i" } },
        { bikebrand: { $regex: keyword, $options: "i" } },
      ];
    }

    this.query = this.query.find(query); // Ensure chaining the query correctly
    return this;
  }

  filter() {
    const queryStrcopy = { ...this.queryStr };
    const removeFields = ["keyword", "limit", "page"];
    removeFields.forEach((field) => delete queryStrcopy[field]);
    let queryStr = JSON.stringify(queryStrcopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    this.query.find(JSON.parse(queryStr));
    return this;
  }

  paginate(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
