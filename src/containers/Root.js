import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import Routes from '../routes';
import { changeFfmpegPath } from '../actions/settingsActions';
import { ConnectedRouter } from 'react-router-redux';

const ffbinaries = window.require('ffbinaries');
const fs = window.require('fs');
const os = window.require('os');

class Root extends Component {
    componentWillMount() {
        this.props.readyFfmpeg();
    }

    render() {
        return (
            <Provider store={this.props.store}>
                <ConnectedRouter history={this.props.history}>
                    <Routes />
                </ConnectedRouter>
            </Provider>
        );
    }
}

export default connect(
    (store) => {
        return {
            ffmpegPath: store.settings.ffmpegPath
        };
    },
    (dispatch) => {
        return {
            readyFfmpeg: () => {
                let dest = './binaries';
                if (!fs.existsSync(dest)) {
                    ffbinaries.downloadFiles(['ffmpeg'], {
                        platform: os.platform(),
                        quiet: true,
                        destination: dest
                    }, function () {
                        dispatch(changeFfmpegPath(dest))
                    });
                }
            }
        }
    })(Root)