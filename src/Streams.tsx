import React, { FunctionComponent } from 'react';
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import { StreamsQueryComponent, StreamsPage } from './data/types'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Skeleton from 'react-loading-skeleton';
import { AppBar, Grid, TextField, Tooltip, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import { Header } from "./header/header";

type Props = {
    database: string;
}

gql`
query StreamsQuery($database: String!){
  database(name: $database) {
    id,
    name,
    streams {
      total
      names
    }
  },
}`;

interface StreamsProps {
    database: string;
    page: StreamsPage;
}

const StreamsContent: FunctionComponent<StreamsProps> = ({ database, page }) => {
    if (!page.names || page.names.length === 0) {
        return <List><ListItem><ListItemText>No Streams in database</ListItemText></ListItem></List>
    }
    return <List>
        {page.names.map((name) => (<ListItem button component={Link} to={`/${encodeURIComponent(database)}/${encodeURIComponent(name)}`}><ListItemText>{name}</ListItemText></ListItem>))}
    </List>
}

const useStyles = makeStyles(theme => ({
    paper: {
        //maxWidth: 936,
        margin: '24px',
        overflow: 'hidden',
    },
    searchBar: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    },
    searchInput: {
        fontSize: theme.typography.fontSize,
    },
    block: {
        display: 'block',
    },
    addStream: {
        marginRight: theme.spacing(1),
    },
    contentWrapper: {
        margin: '40px 16px',
    },
}));

export const Streams: FunctionComponent<Props> = ({ database }) => {
    const classes = useStyles();

    return (<StreamsQueryComponent variables={{ database }}>
        {({ data, error, loading }) => {
            if (loading) {
                return <Paper>
                    <List>
                        {Array.from(Array(3).keys()).map((i) => <ListItem key={i} button disabled><ListItemText><Skeleton /></ListItemText></ListItem>)}
                    </List>
                </Paper>
            }

            if (error) {
                return <Paper>
                    <Typography variant="h5" component="h3">
                        Error
                    </Typography>
                    <Typography component="p">
                        {error}
                    </Typography>
                </Paper>
            }

            var page: StreamsPage = { total: 0 };
            if (data && data.database && data.database.streams) {
                page = data.database.streams
            }

            return (
                <>
                    <Header />
                    <Paper className={classes.paper}>
                        <AppBar className={classes.searchBar} position="static" color="default" elevation={0}>
                            <Toolbar>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item>
                                        <SearchIcon className={classes.block} color="inherit" />
                                    </Grid>
                                    <Grid item xs>
                                        <TextField
                                            fullWidth
                                            placeholder="Search by stream name. Wildcard (*) supported"
                                            InputProps={{
                                                disableUnderline: true,
                                                className: classes.searchInput,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained" component={Link} to={`/${encodeURIComponent(database)}/new`} color="primary" className={classes.addStream}>
                                            new stream
                                        </Button>
                                        <Tooltip title="Reload">
                                            <IconButton>
                                                <RefreshIcon className={classes.block} color="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Toolbar>
                        </AppBar>
                        <div className={classes.contentWrapper}>
                            {/* <Typography color="textSecondary" align="center">
                                No streams for this database yet
                            </Typography> */}
                            <StreamsContent database={database} page={page} />
                        </div>
                    </Paper>
                </>
            );
          
        }}</StreamsQueryComponent>
    )
}
