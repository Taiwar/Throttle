import React, { Component } from 'react';
import { Button, Card, Col, Icon, Row } from 'react-materialize';
import { Link } from 'react-router-dom';

export default class SettingsPage extends Component {
    render() {
        return (
            <div>
                <Row>
                    <Col className='m12'>
                        <Card className='dark-panel z-depth-4'>
                            <Link className='right' to="">
                                <Button className='purple darken-3'>Back<Icon className="white-text">clear</Icon></Button>
                            </Link>
                            <h2>
                                Settings
                            </h2>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}