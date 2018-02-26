import React, { Component } from "react";
import { Collection, CollectionItem, ProgressBar } from "react-materialize";

export default class DownloadsList extends Component {
    render() {
        const { downloads, outputDir, actions } = this.props;

        const correctIcon = (download) => {
            if (!download.isFinished && !download.isDownloading) {
                return (
                    <a href='#' onClick={() => actions.onStartClick(download.id, download.info, outputDir)} className="secondary-content">
                        <i className="material-icons">arrow_downward</i>
                    </a>
                )
            } else if (!download.isFinished && download.isDownloading) {
                return (
                    <a className="secondary-content">
                        <i className="material-icons">autorenew</i>
                    </a>
                )
            } else {
                return (
                    <a href='#' onClick={() => actions.onRemoveClick(download.id)} className="secondary-content">
                        <i className="material-icons">check_circle</i>
                    </a>
                )
            }

        };
        const progressBar = (download) => {
            if (!download.isFinished && download.isDownloading) {
                return (
                    <ProgressBar/>
                )
            }
        };
        const list = () => {
            return downloads.map(function(download){
                return (
                    <CollectionItem className='avatar grey darken-3' key={download.id}>
                        <span className='title'>{download.info.title}</span>
                        <p>{download.url}</p>
                        {correctIcon(download)}
                        {progressBar(download)}
                    </CollectionItem>
                );
            });
        };

        return (
            <Collection>
                {list()}
            </Collection>
        )
    }
}