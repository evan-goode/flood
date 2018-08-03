import axios from "axios";

import AppDispatcher from "../dispatcher/AppDispatcher";
import ActionTypes from "../constants/ActionTypes";
import ConfigStore from "../stores/ConfigStore";

const baseURI = ConfigStore.getBaseURI();

const WebSearchActions = {
  search: query => {
    return axios
      .get(`${baseURI}api/web-search`, { params: { query } })
      .then((json = {}) => json.data)
      .then(
        torrents => {
          AppDispatcher.dispatchServerAction({
            type: ActionTypes.FLOOD_WEB_SEARCH_SUCCESS,
            data: {
              torrents
            }
          });
        },
        error => {
          AppDispatcher.dispatchServerAction({
            type: ActionTypes.FLOOD_WEB_SEARCH_ERROR,
            data: {
              error
            }
          });
        }
      );
  }
};

export default WebSearchActions;
