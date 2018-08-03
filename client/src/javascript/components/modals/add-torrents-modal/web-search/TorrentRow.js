import React from "react";
import { Checkbox } from "flood-ui-kit";

export default class TorrentRow extends React.PureComponent {
  onChange = event => {
    this.props.handleCheck(this.props.torrent.magnet, event.target.checked);
  };
  render() {
    return (
      <tr key={this.props.torrent.desc}>
        <td className="web-search__cell--description">
          <a href={this.props.torrent.desc} target="_blank">
            {this.props.torrent.title}
          </a>
        </td>
        <td className="web-search__cell--seeds">{this.props.torrent.seeds}</td>
        <td>
          <Checkbox
            checked={this.props.checked}
            useProps={true}
            onChange={this.onChange}
          />
        </td>
      </tr>
    );
  }
}
