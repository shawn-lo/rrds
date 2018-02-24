import React, {Component} from 'react';
import {BrowserRouter, Route, withRouter, Redirect} from 'react-router-dom';
import './App.css';
import axios from 'axios';
import {Container, Dropdown, Grid, Image, Menu, Sidebar, Icon, Label} from 'semantic-ui-react';
import AcctContainer from './containers/AcctContainer';
import DocsContainer from './containers/DocsContainer';


class App extends Component {

    state = {
        visible: false,
        activeItem: '',
        docsNum: 0,
    };

    toggleVisibility = () => this.setState({visible: !this.state.visible});

    hideSidebar = () => this.setState({visible: false});

    constructor(props) {
        super(props);
    }

    setActiveTab(activeTabIndex, docsNum) {
        this.setState({activeItem: activeTabIndex, docsNum: docsNum});
    }

    changeTab = (event, { name }) => {
        this.setState({
            activeItem: name,
            // activeTab: (<DocsContainer/>),
        });
        this.props.history.push('/' + name);
    }

    render() {
        const activeItem = this.state.activeItem;
        // let activeTab = (<AcctContainer/>);
        let activeTab = (<DocsContainer/>);
        return (
            <Grid>
                <Grid.Column width={16}>
                    <Menu inverted attached>
                        <Menu.Item name='sidebar' onClick={this.toggleVisibility}>
                            <Icon color='grey' name='sidebar'/>
                        </Menu.Item>
                        <Container>
                            <Menu.Item as='a' header>
                                <Image
                                    size='mini'
                                    src='/src/logo.svg'
                                    style={{marginRight: '1.5em'}}
                                />
                                Project Name
                            </Menu.Item>
                            <Menu.Item as='a'>Home</Menu.Item>

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
                    <Sidebar as={Menu} animation='overlay' width='thin' visible={this.state.visible}
                             icon='labeled'
                             vertical
                             inverted>
                        <Menu.Item name='logo' onClick={this.hideSidebar}>
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

                <Grid.Column width={13}>
                    <Sidebar.Pusher onClick={this.hideSidebar}>
                        <Menu pointing secondary>
                            <Menu.Item name='acct' active={activeItem === 'acct'} onClick={this.changeTab}>
                                Account
                            </Menu.Item>
                            <Menu.Item name='docs' active={activeItem === 'docs'} onClick={this.changeTab}>
                                Documents
                                <Label color='blue'>{this.state.relatedDocsNum}</Label>
                            </Menu.Item>
                            <Menu.Item name='dbr' active={activeItem === 'dbr'} onClick={this.changeTab}>
                                Debtor
                            </Menu.Item>
                            <Menu.Menu position='right'>
                                <Menu.Item name='logout' active={activeItem === 'logout'} />
                            </Menu.Menu>
                        </Menu>

                        {/*<div className="ui secondary pointing menu">*/}
                            {/*<a name='Account' className={activeTabIdx == 'Account' ? "item active" : "item"}*/}
                               {/*onClick={this.changeTab}>*/}
                                {/*Account*/}
                            {/*</a>*/}
                            {/*<a name='docs' className={activeTabIdx == 'docs' ? "item active" : "item"}*/}
                               {/*onClick={this.changeTab}>*/}
                                {/*Documents*/}
                            {/*</a>*/}
                            {/*<a name='tab3' className={activeTabIdx == 'tab3' ? "item active" : "item"}*/}
                               {/*onClick={this.changeTab}>*/}
                                {/*Debtor*/}
                            {/*</a>*/}
                            {/*<div className="right menu">*/}
                                {/*<a className="ui item">*/}
                                    {/*Logout*/}
                                {/*</a>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        <div className="ui segment">
                            {/*<Route path="/Account" component={AcctContainer} />*/}
                            {/*<Route path="/docs" component={DocsContainer} />*/}
                            <Redirect to="/acct" />
                            <Route exact path="/acct"
                                   render={() => <AcctContainer
                                       setActiveTab={(activedTab, docsNum) => this.setActiveTab(activedTab, docsNum)}/>}/>
                            <Route exact path="/docs"
                                   render={() => <DocsContainer
                                       setActiveTab={(activedTab, docsNum) => this.setActiveTab(activedTab, docsNum)}/>}/>
                        </div>
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

export default withRouter(App);
