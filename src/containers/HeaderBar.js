import React, { Component } from "react";
import { Button } from "react-materialize";
import { addDownload, changeInput } from "../actions/downloadsActions";
import { connect } from "react-redux";
import { changeOutputDir } from "../actions/settingsActions";

const ytdl = window.require('ytdl-core');
const dialog = window.require('electron').remote.dialog;

class HeaderBar extends Component {
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
        return (
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
                            <b>Output dir: </b>{this.props.outputDir? this.props.outputDir : "./"}
                        </li>
                        <li>
                            <Button className='purple darken-3' onClick={() => this.handleOutputChange()}>
                                Set
                            </Button>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default connect(
    (store) => {
        return {
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
                    dispatch(addDownload(url, info));
                });
            },
            onChangeOutputClick: () => {
                // noinspection JSCheckFunctionSignatures
                dialog.showOpenDialog(null, {properties: ['openDirectory']},
                    (dirname) => {
                        dispatch(changeOutputDir(dirname.toString()));
                    }
                );
            }
        }
    })(HeaderBar)