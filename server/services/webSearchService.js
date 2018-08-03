"use strict";
const TorrentSearchApi = require("torrent-search-api");

class WebSearchService {
  constructor() {
    this.torrentSearch = new TorrentSearchApi();
    this.torrentSearch.enableProvider("ThePirateBay");
    // this.torrentSearch.enableProvider("Rarbg");
  }
  async search(req, callback) {
    if (!req.query) {
      return callback(null, "search query not provided");
    }
    let torrents;
    try {
      torrents = await this.torrentSearch.search(req.query);
      callback(torrents.filter(torrent => !!torrent));
    } catch (error) {
      callback(null, error);
    }
  }
}
module.exports = new WebSearchService();
