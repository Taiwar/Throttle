import React, { Component } from 'react';
import { Button, Card, Col, Row } from 'react-materialize';
import HeaderBar from '../containers/HeaderBar';
import DownloadsList from '../components/DownloadsList';
import { connect } from 'react-redux';
import { endDownload, removeDownload, startDownload, startDownloads } from '../actions/downloadsActions';
import sanitize from 'sanitize-filename';

const fs = window.require('fs');
const path = window.require('path');
const ffmpeg = window.require('fluent-ffmpeg');
const ytdl = window.require('ytdl-core');
const NodeID3 = window.require('node-id3');

class HomePage extends Component {
    handleStartAll() {
        this.props.onStartAllClick(this.props.downloads, this.props.outputDir);
    }

    render() {
        const { downloads, outputDir, onStartClick, onRemoveClick } = this.props;
        const listActions = { onStartClick, onRemoveClick };

        return (
            <div>
                <HeaderBar />
                <Row>
                    <Col className='m8 offset-m2'>
                        <Card className='dark-panel z-depth-4'>
                            <Button href="" className='left-align purple darken-3' onClick={() => this.handleStartAll()}>
                                Download All
                            </Button>
                            <hr/>
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
            outputDir: store.settings.outputDir
        };
    },
    (dispatch) => {
        return {
            onRemoveClick: (download) => {
                if (download.proc && !download.isFinished) {
                    download.proc.kill();
                }
                dispatch(removeDownload(download.id));
            },
            onStartClick: (id, info, outputDir) => {
                // TODO: Look into formats, don't just choose the first one
                const format = ytdl.filterFormats(info.formats, 'audioonly')[0];
                const stream = ytdl.downloadFromInfo(info, { filter: 'audioonly', format: format});
                const proc = new ffmpeg({source:stream});
                let tags = {
                    title: sanitize(info.title),
                    artist: sanitize(info.author.name),
                };
                proc.setFfmpegPath('./binaries/ffmpeg.exe');
                proc.withAudioCodec('libmp3lame')
                    .toFormat('mp3')
                    .output(path.join(outputDir, sanitize(info.title)  + '.mp3'))
                    .run();
                proc.on('end', function() {
                    NodeID3.write(tags, this._currentOutput.target);
                    dispatch(endDownload(id));
                });
                proc.on('error', function(err) {
                    console.log("FFMPEG stopped", err);
                    fs.unlink(this._currentOutput.target, (err) => console.log("Couldn't delete file", err));
                });
                dispatch(startDownload(id, proc));
            },
            onStartAllClick: (downloads, outputDir) => {
                let startedDownloads = [];
                downloads.forEach((download) => {
                    const format = ytdl.filterFormats(download.info.formats, 'audioonly')[0];
                    let stream = ytdl.downloadFromInfo(download.info, { filter: 'audioonly', format: format});
                    let proc = new ffmpeg({source:stream});
                    proc.setFfmpegPath('./binaries/ffmpeg.exe');
                    proc.withAudioCodec('libmp3lame')
                        .toFormat('mp3')
                        .output(path.join(outputDir, sanitize(download.info.title) + '.mp3'))
                        .run();
                    startedDownloads.push({...download, proc: proc, isDownloading: true});
                    proc.on('end', function() {
                        dispatch(endDownload(download.id));
                    });
                    proc.on('error', function(err) {
                        console.log("FFMPEG stopped", err);
                        fs.unlink(this._currentOutput.target, (err) => console.log("Couldn't delete file", err));
                    });
                });
                dispatch(startDownloads(startedDownloads));
            }
        }
    })(HomePage)