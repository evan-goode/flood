import { Button, Form, FormRow, Textbox } from "flood-ui-kit";
import { injectIntl } from "react-intl";
import React from "react";

import AddTorrentsActions from "./AddTorrentsActions";

import SettingsStore from "../../../stores/SettingsStore";
import UIStore from "../../../stores/UIStore";
import EventTypes from "../../../constants/EventTypes";
import TextboxRepeater from "../../general/form-elements/TextboxRepeater";
import TorrentActions from "../../../actions/TorrentActions";
import WebSearchActions from "../../../actions/WebSearchActions";
import TorrentDestination from "../../general/filesystem/TorrentDestination";
import TorrentRow from "./web-search/TorrentRow";

class AddTorrentsFromWebSearch extends React.Component {
  _formData = {};
  _formRef = null;

  state = {
    errors: {},
    isAddingTorrents: false,
    tags: "",
    urlTextboxes: [{ value: "" }],
    startTorrents: SettingsStore.getFloodSettings("startTorrentsOnLoad"),
    isSearching: false,
    selectedTorrents: new Map(),
    searchResults: null,
    searchError: null
  };

  componentDidMount() {
    UIStore.listen(
      EventTypes.FLOOD_WEB_SEARCH_ERROR,
      this.handleWebSearchError
    );
    UIStore.listen(
      EventTypes.FLOOD_WEB_SEARCH_SUCCESS,
      this.handleWebSearchSuccess
    );
  }

  componentWillUnmount() {
    UIStore.unlisten(
      EventTypes.FLOOD_WEB_SEARCH_ERROR,
      this.handleWebSearchError
    );
    UIStore.unlisten(
      EventTypes.FLOOD_WEB_SEARCH_SUCCESS,
      this.handleWebSearchSuccess
    );
  }

  getURLsFromWebSearch() {
    return [...this.state.selectedTorrents]
      .filter(([key, value]) => !!value)
      .map(([key, value]) => key);
  }

  handleSearch = () => {
    const formData = this._formRef.getFormData();
    this.setState({ isSearching: true });
    WebSearchActions.search(formData.query);
  };

  handleWebSearchError = error => {
    this.setState({
      selectedTorrents: new Map(),
      isSearching: false,
      searchError: error,
      searchResults: null
    });
  };

  handleWebSearchSuccess = ({ torrents }) => {
    this.setState({
      selectedTorrents: new Map(),
      isSearching: false,
      searchError: null,
      searchResults: torrents
    });
  };

  handleAddTorrents = () => {
    const formData = this._formRef.getFormData();
    this.setState({ isAddingTorrents: true });

    console.log("geturls in websearch", this.getURLsFromWebSearch());
    TorrentActions.addTorrentsByUrls({
      urls: this.getURLsFromWebSearch(),
      destination: formData.destination,
      isBasePath: formData.useBasePath,
      start: formData.start,
      tags: formData.tags.split(",")
    });

    SettingsStore.updateOptimisticallyOnly({
      id: "startTorrentsOnLoad",
      data: formData.start
    });
  };

  handleFormChange = ({ event, formData }) => {
    this._formData = formData;
  };

  handleCheck = (magnet, value) => {
    const selectedTorrents = new Map(this.state.selectedTorrents);
    selectedTorrents.set(magnet, value);
    this.setState({ selectedTorrents });
  };

  render() {
    const torrentTable = (() => {
      if (this.state.searchError) {
        return this.props.intl.formatMessage({
          id: "torrents.add.tab.search.error",
          defaultMessage: "Error"
        });
      }
      if (this.state.searchResults) {
        if (this.state.searchResults.length) {
          return (
            <table className="web-search__table">
              <colgroup>
                <col width="100%" />
                <col width="0" />
                <col width="0" />
              </colgroup>
              <thead>
                <tr>
                  <td>Title</td>
                  <td>Seeders</td>
                  <td>Add</td>
                </tr>
              </thead>
              <tbody>
                {this.state.searchResults.map(torrent => (
                  <TorrentRow
                    torrent={torrent}
                    handleCheck={this.handleCheck}
                    checked={this.state.selectedTorrents.get(torrent.magnet)}
                  />
                ))}
              </tbody>
            </table>
          );
        } else {
          return this.props.intl.formatMessage({
            id: "torrents.add.tab.search.no-results",
            defaultMessage: "No results found."
          });
        }
      }
    })();
    return (
      <Form
        className="inverse"
        onChange={this.handleFormChange}
        ref={ref => (this._formRef = ref)}
      >
        <FormRow>
          <Textbox id="query" label="Search query" />
          <Button
            isLoading={this.state.isSearching}
            labelOffset
            priority="primary"
            type="button"
            width="auto"
            onClick={this.handleSearch}
          >
            Search
          </Button>
        </FormRow>
        {torrentTable}
        <TextboxRepeater
          id="urls"
          label={this.props.intl.formatMessage({
            id: "torrents.add.torrents.label",
            defaultMessage: "Torrents"
          })}
          placeholder={this.props.intl.formatMessage({
            id: "torrents.add.tab.url.input.placeholder",
            defaultMessage: "Torrent URL or Magnet Link"
          })}
        />
        <TorrentDestination
          id="destination"
          label={this.props.intl.formatMessage({
            id: "torrents.add.destination.label",
            defaultMessage: "Destination"
          })}
        />
        <FormRow>
          <Textbox
            id="tags"
            defaultValue={this.state.tags}
            label={this.props.intl.formatMessage({
              id: "torrents.add.tags",
              defaultMessage: "Tags"
            })}
          />
        </FormRow>
        <AddTorrentsActions
          dismiss={this.props.dismissModal}
          onAddTorrentsClick={this.handleAddTorrents}
          isAddingTorrents={this.state.isAddingTorrents}
        />
      </Form>
    );
  }
}

export default injectIntl(AddTorrentsFromWebSearch, { withRef: true });
