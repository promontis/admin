import React, { FunctionComponent } from 'react';
import gql from "graphql-tag";
import { Query, QueryResult } from 'react-apollo';
import { Alert } from 'reactstrap';
import { Link } from "react-router-dom";
import { Spinner, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { StreamQuery} from './types/StreamQuery';
import { Table } from 'reactstrap';
import TimeAgo from 'react-timeago';
import prettyBytes from 'pretty-bytes';

type Props = {
  database: string;
  stream: string;
  from?: number;
  limit: number;
}

const query = gql`
query StreamQuery($database: String!, $stream: String!, $from: Int!, $limit: Int!){
   readStream(db: $database, name:$stream, from: $from, limit: $limit) {
   	stream
    from
    next
    hasNext
    head
    messages {
      position
      type
      timestamp
      value
    }
  }
}`;

export const Stream: FunctionComponent<Props> = ({database, stream, from, limit}) => {
  if (!from) {
    from = 1
  }

  return <>
    <Query query={query} variables={{database, stream, from, limit}}>
      {({ data, error, loading }: QueryResult<StreamQuery>) => {
        if(loading) {
          return <div>
            <Spinner color="primary" />
          </div>;
        } 
        if(error) {
          return <div>
            <Alert color="primary">
              failed to query stream {stream}: {error.message}
            </Alert>
          </div>
        }

        if(!data || !data.readStream || !data.readStream.messages) {
          return <Alert color="primary">
            not found
          </Alert>
        }

        var { head, from, messages } = data.readStream;
        var last = head-limit;
        var rows = messages.sort((a,b) => a.timestamp > b.timestamp ? -1: 1).map((m) =>
            <tr>
            <th scope="row">{m.position}</th>
            <td>{m.value}</td>
            <td>{m.type}</td>
            <td>{prettyBytes(m.value.length)}</td>
            <td><TimeAgo date={m.timestamp} /></td>
            </tr>
        );

        return <div>
          <Pagination>
            <PaginationItem disabled={from === 1}>
              <PaginationLink first tag={Link} to={`/db/${database}/streams/${stream}/1`} />
            </PaginationItem>
            <PaginationItem disabled={from === 1}>
              <PaginationLink previous tag={Link} to={`/db/${database}/streams/${stream}/${data.readStream.from-limit}`} />
            </PaginationItem>
            <PaginationItem disabled={from >= last}>
              <PaginationLink next tag={Link} to={`/db/${database}/streams/${stream}/${data.readStream.next}`}/>
            </PaginationItem>
            <PaginationItem disabled={from >= last}>
              <PaginationLink last tag={Link} to={`/db/${database}/streams/${stream}/${last}`} />
            </PaginationItem>
          </Pagination>
          <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>name</th>
            <th>type</th>
            <th>size</th>
            <th>timestamp</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
          </div>
      }}
    </Query>
  </>
}
