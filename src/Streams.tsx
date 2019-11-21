import React, { FunctionComponent } from 'react';
import gql from "graphql-tag";
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
import { Header } from './header/header';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import Link from '@material-ui/core/Link';

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

const Link1 = React.forwardRef<HTMLAnchorElement, RouterLinkProps>((props, ref) => (
    <RouterLink innerRef={ref} {...props} />
  ));

const StreamsContent: FunctionComponent<StreamsProps> = ({ database, page }) => {

    if (!page.names || page.names.length === 0) {

        return (
            <List>
                <ListItem>
                    <ListItemText>
                        No Streams in database
                    </ListItemText>
                </ListItem>
            </List>
        );
    }

    return (
        <Table aria-label="simple table">
            {/* <TableHead>
                <TableRow>
                    <TableCell>Stream</TableCell>
                    <TableCell align="right">Calories</TableCell>
                    <TableCell align="right">Fat&nbsp;(g)</TableCell>
                    <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                    <TableCell align="right">Protein&nbsp;(g)</TableCell>
                </TableRow>
            </TableHead> */}
            <TableBody>
                {page.names.map(name => (
                    <TableRow key={name}>
                        <TableCell component="th" scope="row">
                            <Link component={Link1} to={`/${encodeURIComponent(database)}/${encodeURIComponent(name)}`}>
                                {name}
                            </Link>
                        </TableCell>
                        {/* <TableCell align="right">
                            {name}
                        </TableCell>
                        <TableCell align="right">
                            {name}
                        </TableCell>
                        <TableCell align="right">
                            {name}
                        </TableCell>
                        <TableCell align="right">
                            {name}
                        </TableCell> */}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

const useStyles = makeStyles(theme => ({
    paper: {
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
    
    },
}));

export const Streams: FunctionComponent<Props> = ({ database }) => {

    const classes = useStyles();

    return (
        <>
            <Header database={database} />
            <StreamsQueryComponent variables={{ database }}>

                {({ data, error, loading }) => {
                    
                    if (loading) {

                        return (
                            <Paper>
                                <List>
                                    {
                                        Array.from(Array(3).keys()).map((i) => 
                                            <ListItem key={i} button disabled>
                                                <ListItemText>
                                                    <Skeleton />
                                                </ListItemText>
                                            </ListItem>
                                        )
                                    }
                                </List>
                            </Paper>
                        );
                    }

                    if (error) {

                        return (
                            <Paper>
                                <Typography variant="h5" component="h3">
                                    Error
                                </Typography>
                                <Typography component="p">
                                    {error}
                                </Typography>
                            </Paper>
                        );
                    }

                    var page: StreamsPage = { total: 0 };
                    if (data && data.database && data.database.streams) {
                        page = data.database.streams
                    }

                    return (
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
                                            <Button variant="contained" component={RouterLink} to={`/${encodeURIComponent(database)}/new`} color="primary" className={classes.addStream}>
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
                    );

                }}</StreamsQueryComponent>
        </>
    )
}
