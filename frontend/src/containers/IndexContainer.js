import React, {Component} from 'react';
import {Container, Dropdown, Grid, Image, Menu, Sidebar, Icon, Label} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import 'redux';
import 'react-redux';
import {bindActionCreators} from 'redux';
import {
    toggleSidebarVisibility,
    changeTab,
} from '../actions/IndexAction';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

class IndexContainer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid>
                <Grid.Column width={16}>
                    <Menu inverted attached>
                        <Menu.Item name='sidebar' onClick={() => this.props.toggleSidebarVisibility()}>
                            <Icon color='grey' name='sidebar'/>
                        </Menu.Item>
                        <Container>
                            <Menu.Item as='a' header>
                                <Image
                                    size='mini'
                                    src='/src/logo.svg'
                                    style={{marginRight: '1.5em'}}
                                />
                                Project C3
                            </Menu.Item>
                            <Menu.Item as='a' onClick={() => this.props.toggleSidebarVisibility()}>Home</Menu.Item>

                            <Dropdown item simple text='Dropdown'>
                                <Dropdown.Menu>
                                    <Dropdown.Item>List Item</Dropdown.Item>
                                    <Dropdown.Item>List Item</Dropdown.Item>
                                    <Dropdown.Divider/>
                                    <Dropdown.Header>Header Item</Dropdown.Header>
                                    <Dropdown.Item>
                                        <i className='dropdown icon'/>
                                        <span className='text'>Submenu</span>
                                        <Dropdown.Menu>
                                            <Dropdown.Item>List Item</Dropdown.Item>
                                            <Dropdown.Item>List Item</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown.Item>
                                    <Dropdown.Item>List Item</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Container>
                    </Menu>
                </Grid.Column>
                <Grid.Column width={2}>
                    <Sidebar as={Menu} animation='overlay' width='thin' visible={this.props.sidebarVisible}
                             icon='labeled'
                             vertical
                             inverted>
                        <Menu.Item name='logo' onClick={() => this.props.toggleSidebarVisibility()}>
                            Project C3
                        </Menu.Item>
                        <Menu.Item name='home'>
                            <Icon name='home'/>
                            Home
                        </Menu.Item>
                        <Menu.Item name='gamepad'>
                            <Icon name='gamepad'/>
                            Games
                        </Menu.Item>
                        <Menu.Item name='camera'>
                            <Icon name='camera'/>
                            Channels
                        </Menu.Item>
                    </Sidebar>
                </Grid.Column>

                <Grid.Column width={12}>
                    <Sidebar.Pusher>
                        <Menu pointing secondary>
                            <Menu.Item as={Link} to='/acct' name='acct' active={this.props.activedTab === 'acct'}
                                       onClick={() => this.props.changeTab('acct')}>
                                Account
                            </Menu.Item>
                            <Menu.Item name='docs' active={this.props.activedTab === 'docs'}
                                       onClick={() => this.props.changeTab('docs')}>
                                Documents
                                <Label color='blue'>10</Label>
                            </Menu.Item>
                            <Menu.Item as={Link} to='/about' name='dbr' active={this.props.activedTab === 'dbr'}
                                       onClick={() => this.props.changeTab('dbr')}>
                                Debtor
                            </Menu.Item>
                        </Menu>
                    </Sidebar.Pusher>
                </Grid.Column>

                <Grid.Column width={2}>
                </Grid.Column>
                <Grid.Column width={14}>

                </Grid.Column>

            </Grid>

        );
    }
}

// map store state to container props
function mapStateToProps(state) {
    return {
        sidebarVisible: state.sidebarChanged.sidebarVisibility,
        activedTab: state.tabChanged.activedTab,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleSidebarVisibility: toggleSidebarVisibility,
        changeTab: changeTab,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IndexContainer);
