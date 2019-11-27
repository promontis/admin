import React, { FunctionComponent } from 'react';
import { DatabasesComponent } from '../data/types';
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Skeleton from 'react-loading-skeleton';
import { ListItemIcon, IconButton, makeStyles, Button } from '@material-ui/core';
import clsx from 'clsx';
import DatabaseIcon from '@material-ui/icons/Storage';
import LogoIcon from './../LogoIcon';
import { Link as RouterLink } from "react-router-dom";
type Props = {
}

gql`
query Databases{
  databases {
    names
  },
}`;

const drawerWidth = 256;
const lightColor = 'rgba(255, 255, 255, 0.7)';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
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
    drawerHeader: {
        backgroundColor: '#232f3e',
        boxShadow: '0 -1px 0 #404854 inset',
        paddingTop: '16px',
        paddingBottom: '16px'
    },
    drawerSubHeader: {
        color: '#fff',
        fontWeight: 500,
        fontSize: '1rem'
    },
    drawerItem: {
        color: 'rgba(255, 255, 255, 0.7)',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)'
        }
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
    categoryHeader: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    categoryHeaderPrimary: {
        color: theme.palette.common.white,
    },
    item: {
        paddingTop: 1,
        paddingBottom: 1,
        color: 'rgba(255, 255, 255, 0.7)',
        '&:hover,&:focus': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
    },
    itemCategory: {
        backgroundColor: '#232f3e',
        boxShadow: '0 -1px 0 #404854 inset',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    firebase: {
        fontSize: 24,
        color: theme.palette.common.white,
        height: '82px'
    },
    itemActiveItem: {
        color: '#4fc3f7',
    },
    itemPrimary: {
        fontSize: 'inherit',
    },
    itemIcon: {
        minWidth: 'auto',
        marginRight: theme.spacing(2),
    },
    divider: {
        marginTop: theme.spacing(2),
    },
    link: {
        marginRight: '20px',
        textDecoration: 'none',
        color: lightColor,
        '&:hover': {
            color: theme.palette.common.white,
        },
    },
    addDatabase: {
        marginRight: theme.spacing(1),
    },
}));



export const Databases: FunctionComponent<Props> = () => {

    const classes = useStyles();

    return (
        <DatabasesComponent>

            {({ data, error, loading }) => {

                var names: string[] = [];

                if (data && data.databases && data.databases.names) {
                    names = data.databases.names
                }

                // todo:
                if (loading) {
                    return <Paper>
                        <List>
                            {Array.from(Array(3).keys()).map((i) => <ListItem key={i} button disabled><ListItemText><Skeleton /></ListItemText></ListItem>)}
                        </List>
                    </Paper>
                }

                if (error) {
                    return <Paper><Typography variant="h5" component="h3">
                        Error
                         </Typography>
                        <Typography component="p">
                            {JSON.stringify(error)}
                        </Typography></Paper>
                }

                return (
                    <List disablePadding>
                        <ListItem className={clsx(classes.firebase, classes.item, classes.itemCategory)}>
                            <IconButton component={RouterLink} to={"/"} edge="end">
                                <LogoIcon />
                            </IconButton>
                        </ListItem>
                        <ListItem className={classes.categoryHeader}>
                            <ListItemText classes={{ primary: classes.categoryHeaderPrimary, }}>
                                Databases
                    </ListItemText>
                            <Button variant="contained" color="primary" className={classes.addDatabase}>
                                new
                    </Button>
                        </ListItem>
                        {
                            names.length === 0
                                ? <ListItem key="empty">There are no databases you have access to</ListItem>
                                : names.map((name) => (
                                    <ListItem
                                        key={name}
                                        button
                                        className={clsx(classes.item)}
                                        component={Link} to={`/${name}`}
                                    >
                                        <ListItemIcon className={classes.itemIcon}>
                                            <DatabaseIcon />
                                        </ListItemIcon>
                                        <ListItemText classes={{ primary: classes.itemPrimary, }}>
                                            {name}
                                        </ListItemText>
                                    </ListItem>
                                ))
                        }
                    </List>
                );
            }}
        </DatabasesComponent>
    );
};

