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
            <Row>
                <Col className="m3">
                    <Card className='card-content-less-margin dark-panel z-depth-4'>
                        <div className="input-field inline">
                            <input onChange={(e) => this.handleInputChange(e.target.value)} type="text" className="active"/>
                            <label htmlFor="first_name">Url</label>
                        </div>
                        <br/>
                        <Button className='purple darken-3' onClick={() => this.handleAdd()}>Add Download</Button>
                        <hr/>
                        <p>Output dir: {this.props.outputDir? this.props.outputDir : "\\"}</p>
                        <br/>
                        <Button className='purple darken-3' onClick={() => this.handleOutputChange()}>
                            Set
                        </Button>
                    </Card>
                </Col>
                <Col className="m7 offset-m1">
                    <Card className='dark-panel z-depth-4'>
                        <DownloadsList downloads={downloads} outputDir={outputDir} actions={listActions}/>
                    </Card>
                </Col>
            </Row>
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
                console.log(info);
                let proc = new ffmpeg({source:stream});
                proc.setFfmpegPath('./node_modules/ffmpeg-binaries/bin/ffmpeg.exe');
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