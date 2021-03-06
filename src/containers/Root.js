import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import Routes from '../routes';
import { changeFfmpegPath } from '../actions/settingsActions';
import { ConnectedRouter } from 'react-router-redux';
import { PersistGate } from 'redux-persist/integration/react'

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
                <PersistGate loading={null} persistor={this.props.persistor}>
                    <ConnectedRouter history={this.props.history}>
                        <Routes />
                    </ConnectedRouter>
                </PersistGate>
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