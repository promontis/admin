import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import './index.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Router } from "react-router-dom";
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { config } from "./Config";
import { SnackbarProvider } from 'notistack';
import { setContext } from 'apollo-link-context';
import { onError } from "apollo-link-error";
import browserHistory from './history';
import AuthProvider from "./login/state";
import * as Sentry from '@sentry/browser';

import {
    createMuiTheme,
    createStyles,
    ThemeProvider,
    withStyles,
    WithStyles,
  } from '@material-ui/core/styles';


if (config.gaId) {
    ReactGA.initialize(config.gaId);
    browserHistory.listen(location => ReactGA.pageview(location.pathname));

    console.log("initialized GA");
}

let theme = createMuiTheme({
    palette: {
        primary: {
            light: '#63ccff',
            main: '#009be5',
            dark: '#006db3',
        },
    },
    typography: {
        h5: {
            fontWeight: 500,
            fontSize: 26,
            letterSpacing: 0.5,
        },
    },
    shape: {
        borderRadius: 8,
    },
    props: {
        MuiTab: {
            disableRipple: true,
        },
    },
    mixins: {
        toolbar: {
            minHeight: 48,
        },
    },
});

theme = {
    ...theme,
    overrides: {
        MuiDrawer: {
            paper: {
                backgroundColor: '#18202c',
            },
        },
        MuiButton: {
            label: {
                textTransform: 'none',
            },
            contained: {
                boxShadow: 'none',
                '&:active': {
                    boxShadow: 'none',
                },
            },
        },
        MuiTabs: {
            root: {
                marginLeft: theme.spacing(1),
            },
            indicator: {
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
                backgroundColor: theme.palette.common.white,
            },
        },
        MuiTab: {
            root: {
                textTransform: 'none',
                margin: '0 16px',
                minWidth: 0,
                padding: 0,
                [theme.breakpoints.up('md')]: {
                    padding: 0,
                    minWidth: 0,
                },
            },
        },
        MuiIconButton: {
            root: {
                padding: theme.spacing(1),
            },
        },
        MuiTooltip: {
            tooltip: {
                borderRadius: 4,
            },
        },
        MuiDivider: {
            root: {
                backgroundColor: '#404854',
            },
        },
        MuiListItemText: {
            primary: {
                fontWeight: theme.typography.fontWeightMedium,
            },
        },
        MuiListItemIcon: {
            root: {
                color: 'inherit',
                marginRight: 0,
                '& svg': {
                    fontSize: 20,
                },
            },
        },
        MuiAvatar: {
            root: {
                width: 32,
                height: 32,
            },
        },
    },
};

const errorLink = onError(({ response, graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            var { message, locations, path } = err
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )

            if (err.extensions) {
                if (err.extensions.code === "Unauthenticated") {
                    localStorage.removeItem('token');
                    browserHistory.push('/login?redirectUrl=' + encodeURI(browserHistory.location.pathname));
                    return;
                }
            }
        }
    }

    if (networkError) {
        console.log(`[Network error]: ${networkError}`);
    }

    //return forward(operation);
});

// the auth token is sent to the server on each request due to this middleware
const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const client = new ApolloClient({
    link: ApolloLink.from([
        errorLink,
        authLink,
        new HttpLink({
            uri: config.graphqlEndpoint,
        })
    ]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    }
});

if (config.sentryDsn) {
    console.log("configured sentry");
    Sentry.init({ dsn: config.sentryDsn });
} else {
    console.log("skipped sentry configuration because sentryDsn is not set");
}

ReactDOM.render(
    <Router history={browserHistory}>
        <ApolloProvider client={client}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <SnackbarProvider maxSnack={10}>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </ApolloProvider>
    </Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
