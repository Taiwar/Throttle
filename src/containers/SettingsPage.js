import React, { Component } from "react";
import { Card, Col, Icon, Row } from "react-materialize";
import { Link } from "react-router-dom";

export default class SettingsPage extends Component {
    render() {
        return (
            <div>
                <Row>
                    <Col className='m10'>
                        <Card className='dark-panel z-depth-4'>
                            <h2>
                                Settings
                            </h2>
                        </Card>
                    </Col>
                    <Col className='m1 offset-m1'>
                        <Link to="">
                            <Icon className="white-text">clear</Icon>
                        </Link>
                    </Col>
                </Row>
            </div>
        );
    }
}