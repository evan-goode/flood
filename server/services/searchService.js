'use strict';
const TorrentSearchApi = require('torrent-search-api');

class SearchService {
  constructor() {
    this.torrentSearch = new TorrentSearchApi();
    this.torrentSearch.enablePublicProviders();
  }
  search(req, callback) {
    console.log(req);
    if (!req.query) {
      return callback(null, "search query not provided");
    }
  }
}
module.exports = new SearchService();
