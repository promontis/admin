import React, { FunctionComponent } from 'react';

import Badge from '@material-ui/core/Badge';
import brace from 'brace';
import AceEditor from 'react-ace';
import Divider from '@material-ui/core/Divider';
import TimeAgo from 'react-timeago';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import prettyBytes from 'pretty-bytes';
import { Link as RouterLink } from "react-router-dom";
import { Message } from '../data/types';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow  from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Toolbar from '@material-ui/core/Toolbar';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import Checkbox from '@material-ui/core/Checkbox';
import { ReadStreamQuery, ReadStreamQueryVariables, ReadStreamDocument } from '../data/types'
import { Query } from "react-apollo";
import { Map } from 'immutable';
import Card from '@material-ui/core/Card'
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  createStyles,
  fade,
  Theme,
  withStyles,
  makeStyles,
  createMuiTheme,
} from '@material-ui/core/styles';

import { spacing } from '@material-ui/system';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

interface Props  {
  database: string;
  stream: string;
  from: number;
  limit: number;
}

function LinkForEventMessage(database: string, stream: string, m: Message) {
  if(m.type !== "sdb.pointer") {
    return (<Link component={RouterLink} to={`/${database}/streams/${stream}/${m.position}/message`}>{stream}/{m.position}</Link>)
  }

  var pointer = JSON.parse(m.value);
  return (<Link component={RouterLink} to={`/${database}/streams/${pointer.s}/${pointer.p}/message`}>{pointer.s}/{pointer.p}</Link>)
}

type PagingProps = {database: string, stream:string, from: number, limit: number, last: number}

const Paging: FunctionComponent<PagingProps> = ({database, stream, from, limit, last}) => {
  const baseUrl = `/feedback/${database}/streams/${stream}`

  return <Grid container alignItems="flex-start" justify="flex-end" direction="row">
    <Tooltip title="Newest">
      <IconButton component={RouterLink} to={`${baseUrl}/last`} aria-label="Newest">
        <FirstPageIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title="Newer">
    <IconButton component={RouterLink} to={`${baseUrl}/${Math.min(from+limit, last)}`} aria-label="Previous Page">
      <KeyboardArrowLeft />
    </IconButton>
    </Tooltip>
    <Tooltip title="Older">
    <IconButton component={RouterLink} to={`${baseUrl}/${Math.max(from-limit, 1)}`} aria-label="Previous Page">
      <KeyboardArrowRight />
    </IconButton>
    </Tooltip>
    <Tooltip title="Oldest">
    <IconButton component={RouterLink} to={`${baseUrl}/1`} aria-label="Previous Page">
      <LastPageIcon />
    </IconButton>
    </Tooltip>
    <div style={{ flex: 1 }}></div>
    <Button color="primary" variant="contained" >New event</Button>
  </Grid>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
    },
    editor: {
      border: '1px solid #e2e2e1',
      overflow: 'hidden',
      borderRadius: 4,
      backgroundColor: '#fcfcfb',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:hover': {
        backgroundColor: '#fff',
      },
      paddingLeft: '5px',
      '&$focused': {
        backgroundColor: '#fff',
        boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
        borderColor: theme.palette.primary.main,
      },
    },

  }),
);

export const List: FunctionComponent<Props> = ({database, stream, from, limit}) => {
  const classes = useStyles();

  return <Query<ReadStreamQuery, ReadStreamQueryVariables> query={ReadStreamDocument} variables={{database, stream, from, limit}}>
      {({ data, error, loading }) => {
        if(loading) { return <CircularProgress />} 
        if(error) { return <pre>{JSON.stringify(error)}</pre> }
        if(!data || !data.readStream || !data.readStream.messages) { return <p>no data</p> }

        from = data.readStream.from;
        const last = Math.max(data.readStream.head-limit, 1);

        return <Grid container spacing={2}>
            <Grid item xs={12}>
              <h2>
              {`${stream} (${from+(limit-1)}-${from})`}
              </h2>
            </Grid>
            <Grid item xs={12}>
              <Paging database={database} stream={stream} from={from} limit={limit} last={last} />
            </Grid>

          {data.readStream.messages.sort((a,b) => a.position > b.position ? -1: 1).map(m => {
            var value;
            try {
              value = JSON.stringify(JSON.parse(m.value), null, 4);
            } catch (e) {
              value = m.value;
            }

            return <Grid item xs={12} justify="space-between">
              <Paper>
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container xs={12} spacing={2}>
                  <Grid className={classes.root} item xs>
                    {m.position}
                  </Grid>
                  <Grid className={classes.root} item xs>
                    {LinkForEventMessage(database, stream, m)}
                  </Grid>
                  <Grid className={classes.root} item xs>
                    {m.type}
                  </Grid>
                  <Grid className={classes.root} item xs>
                    {prettyBytes(m.value.length)}
                  </Grid>
                  <Grid className={classes.root} item xs>
                    <TimeAgo date={m.timestamp} />
                  </Grid>
                </Grid>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
            <Divider />
            <AceEditor
                  readOnly={true}
              className={classes.editor}
                  mode="json"
                  theme="tomorrow"
                  value={value}
                  name="value"
                  editorProps={{$blockScrolling: true}}
                  width="100%"
                  wrapEnabled={true}
                  fontSize={16}
            maxLines={Infinity}
                />   
        </ExpansionPanelDetails>
                  </ExpansionPanel>
              </Paper>
            </Grid>})}
        </Grid>
      }}
  </Query>
}
