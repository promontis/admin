import React from "react";
import { BreadcrumbsRoute } from "react-router-breadcrumbs-hoc";
import { RouteConfig } from "react-router-config";
import { Route, Switch, Redirect } from "react-router-dom";
import { Login, Logout } from "./login";
import { Databases } from "./db/databases";
import { Dashboard } from "./dashboard/dashboard";
import { Streams } from "./Streams";
import { List as StreamList } from "./stream/list";
import { Message } from "./stream/message/message";
import { AppendStream } from "./stream/message/new";
import breadcrumbCreator from './Breadcrumbs';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { Drawer, CssBaseline } from "@material-ui/core";
import { Header } from "./header/header";
import clsx from "clsx";

function MadeWithLove() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            Made with <span style={{ color: "red" }}>❤</span> in Holland
        </Typography>
    );
}

const drawerWidth = 256;
const lightColor = 'rgba(255, 255, 255, 0.7)';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        minHeight: '100vh',
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    title: {
        flexGrow: 1,
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        overflowScrolling: 'touch',
        WebkitOverflowScrolling: 'touch'
    },
    container: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(4),
        overflowScrolling: 'touch',
        WebkitOverflowScrolling: 'touch',
    },
    link: {
        marginRight: '20px',
        textDecoration: 'none',
        color: lightColor,
        '&:hover': {
            color: theme.palette.common.white,
        },
    },
    app: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    main: {
        flex: 1,
        padding: theme.spacing(6, 4),
        background: '#eaeff1',
    },
    footer: {
        padding: theme.spacing(2),
        background: '#eaeff1',
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
}));

const routes: (RouteConfig & BreadcrumbsRoute)[] = [
    {
        exact: true,
        path: "/:database/new",
        component: ({ match }: any) => (<AppendStream database={decodeURIComponent(match.params.database)} stream="" />),
        breadcrumb: "new"
    },
    {
        exact: true,
        path: "/login",
        component: ({ location }: any) => {
            const values = new URLSearchParams(location.search);
            const redirectUrl = values.get("redirectUrl");
            return <Login redirectUrl={redirectUrl} />
        },
        breadcrumb: "login"
    },
    {
        exact: true,
        path: "/logout",
        component: () => <Logout returnUrl={undefined} />,
        breadcrumb: "logout"
    },
    {
        exact: true,
        path: "/",
        component: () => <Dashboard />,
        breadcrumb: "Home"
    },
    {
        exact: true,
        path: "/:database/:stream/new",
        component: ({ match }: any) => (<AppendStream database={decodeURIComponent(match.params.database)} stream={decodeURIComponent(match.params.stream)} />),
        breadcrumb: ({ match }: any) => "new event"
    },
    {
        exact: true,
        path: "/:database",
        component: ({ match }: any) => (<Streams database={decodeURIComponent(match.params.database)} />),
        breadcrumb: ({ match }: any) => decodeURIComponent(match.params.database)
    },
    {
        exact: true,
        path: "/:database/:stream/last",
        component: ({ match }: any) => {
            return (<Redirect to={`/${encodeURIComponent(match.params.database)}/${encodeURIComponent(match.params.stream)}/last/backward`} />)
        },
        breadcrumb: null,
    },
    {
        exact: true,
        path: "/:database/:stream",
        component: ({ match }: any) => {
            return (<StreamList database={decodeURIComponent(match.params.database)} stream={decodeURIComponent(match.params.stream)} from={-1} limit={10} reverse={true} />)
        },
        breadcrumb: ({ match }: any) => decodeURIComponent(match.params.stream)
    },
    {
        exact: true,
        path: "/:database/:stream/:from",
        component: ({ match }: any) => {
            return (<StreamList database={decodeURIComponent(match.params.database)} stream={decodeURIComponent(match.params.stream)} from={parseInt(match.params.from)} limit={10} reverse={true} />)
        },
        breadcrumb: null,
    },
    {
        exact: true,
        path: "/:database/:stream/:from/forward/:limit?",
        component: ({ match }: any) => {
            return (<StreamList database={decodeURIComponent(match.params.database)} stream={decodeURIComponent(match.params.stream)} from={parseInt(match.params.from)} limit={match.params.limit || 10} reverse={false} />)
        },
        breadcrumb: null,
    },
    {
        exact: true,
        path: "/:database/:stream/last/backward/:limit?",
        component: ({ match }: any) => {
            return (<StreamList database={decodeURIComponent(match.params.database)} stream={decodeURIComponent(match.params.stream)} from={-1} limit={match.params.limit || 10} reverse={true} />)
        },
        breadcrumb: null,
    },
    {
        exact: true,
        path: "/:database/:stream/:from/backward/",
        component: ({ match }: any) => {
            return (<StreamList database={decodeURIComponent(match.params.database)} stream={decodeURIComponent(match.params.stream)} from={parseInt(match.params.from)} limit={match.params.limit || 10} reverse={true} />)
        },
        breadcrumb: null,
    },
    {
        exact: true,
        path: "/:database/:stream/:from/backward/:limit?",
        component: ({ match }: any) => {
            return (<StreamList database={decodeURIComponent(match.params.database)} stream={decodeURIComponent(match.params.stream)} from={parseInt(match.params.from)} limit={match.params.limit || 10} reverse={true} />)
        },
        breadcrumb: null,
    },
    {
        exact: true,
        path: "/:database/:stream/last/message/",
        component: ({ match }: any) => {
            return (<Message database={decodeURIComponent(match.params.database)} stream={decodeURIComponent(match.params.stream)} from={-1} />)
        },
        breadcrumb: null,
    },
    {
        exact: true,
        path: "/:database/:stream/:from/message/",
        component: ({ match }: any) => {
            return (<Message database={decodeURIComponent(match.params.database)} stream={decodeURIComponent(match.params.stream)} from={match.params.from} />)
        },
        breadcrumb: () => "message"
    }
]

const Breadcrumbs = breadcrumbCreator(routes, ["/login", "/logout"]);

export default function App() {

    const classes = useStyles();

    const handleDrawerToggle = () => {
        // todo
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Drawer variant="permanent" classes={{ paper: classes.drawer }} open={true}>
                <Databases />
            </Drawer>
            <main className={clsx(classes.app, classes.appBarShift)}>
                <Header onDrawerToggle={handleDrawerToggle} />
                <main className={classes.main}>
                    <Switch>
                        {routes.filter(i => i.component).map(r => <Route exact={r.exact} path={r.path} component={r.component} />)}
                    </Switch>
                </main>
                <footer className={classes.footer}>
                    <MadeWithLove />
                </footer>
            </main>
        </div>
    );
}
