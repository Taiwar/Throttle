import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Card, Col, Row } from 'react-materialize';
import { addDownload, changeInput, endDownload, removeDownload, startDownload } from '../actions/downloadsActions';
import { changeOutputDir } from "../actions/settingsActions";
import DownloadsList from "../components/DownloadsList";

const path = window.require("path");
const ffmpeg = window.require('fluent-ffmpeg');
const ytdl = window.require('ytdl-core');
const dialog = window.require('electron').remote.dialog;

class App extends Component {
    handleAdd() {
        this.props.onAddClick(this.props.inputValue);
    }

    handleInputChange(value) {
        this.props.onInputChange(value);
    }

    handleOutputChange() {
        this.props.onChangeOutputClick();
    }

    render() {
        const { downloads, outputDir, onRemoveClick, onStartClick } = this.props;
        const listActions = {onStartClick: onStartClick, onRemoveClick: onRemoveClick};

        return (
            <div>
                <nav className="purple darken-4">
                    <div className="nav-wrapper">
                        <ul className="left">
                            <li>
                                <input placeholder="Url" onChange={(e) => this.handleInputChange(e.target.value)} type="text" className="active"/>
                            </li>
                            <li>
                                <Button className='purple darken-3' onClick={() => this.handleAdd()}>Add Download</Button>
                            </li>
                        </ul>
                        <ul className="right">
                            <li className="input-field inline">
                                Output dir: {this.props.outputDir? this.props.outputDir : "\\"}
                            </li>
                            <li>
                                <Button className='purple darken-3' onClick={() => this.handleOutputChange()}>
                                    Set
                                </Button>
                            </li>
                        </ul>
                    </div>
                </nav>
                <Row>
                    <Col className="m8 offset-m2">
                        <Card className='dark-panel z-depth-4'>
                            <DownloadsList downloads={downloads} outputDir={outputDir} actions={listActions}/>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(
    (store) => {
        return {
            downloads: store.downloads.downloads,
            inputValue: store.downloads.inputValue,
            outputDir: store.settings.outputDir
        };
    },
    (dispatch) => {
        return {
            onInputChange: (input) => dispatch(changeInput(input)),
            onAddClick: (url) => {
                ytdl.getInfo(url, function(err, info){
                    if (err) {
                        console.log(err);
                        return
                    }
                    dispatch(addDownload(url, info))
                });
            },
            onRemoveClick: (id) => {
                dispatch(removeDownload(id))
            },
            onStartClick: (id, info, outputDir) => {
                dispatch(startDownload(id));
                // TODO: Look into formats, don't just choose the first one
                let format = ytdl.filterFormats(info.formats, 'audioonly')[0];
                let stream = ytdl.downloadFromInfo(info, { filter: 'audioonly', format: format});
                let proc = new ffmpeg({source:stream});
                if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
                    proc.setFfmpegPath('./node_modules/ffmpeg-binaries/bin/ffmpeg.exe');
                } else {
                    proc.setFfmpegPath('./resources/app.asar.unpacked/node_modules/ffmpeg-binaries/bin/ffmpeg.exe');
                }
                proc.withAudioCodec('libmp3lame')
                    .toFormat('mp3')
                    .output(path.join(outputDir, info.title + '.mp3'))
                    .run();
                proc.on('end', function() {
                    dispatch(endDownload(id));
                });
            },
            onChangeOutputClick: () => {
                // noinspection JSCheckFunctionSignatures
                dialog.showOpenDialog(null, {properties: ['openDirectory']},
                    (dirname) => {
                        dispatch(changeOutputDir(dirname.toString()))
                    }
                );
            }
        }
    })(App)