import React from 'react';
import { useLoaderData, defer, Await } from 'react-router-dom';
import { graphql, PreloadedQuery, usePreloadedQuery, loadQuery, Environment, VariablesOf } from 'react-relay';

import * as EpisodeQuery from './__generated__/EpisodeQuery.graphql'

import { Page } from '@/components/Page';
import { PodcastHeader } from '@/components/PodcastHeader';
import { EpisodeHeader } from '@/components/EpisodeHeader';
import { DownloadList } from '@/components/DownloadList';
import { Card } from '@/components/Card';
import { CallList } from '@/components/CallList';

export const loadEpisode = (environment: Environment, variables: VariablesOf<EpisodeQuery.EpisodeQuery>) =>
  defer({ loadQuery: loadQuery(environment, EpisodeQuery.default, variables) });

interface EpisodeContentProps {
  initialQueryRef: PreloadedQuery<EpisodeQuery.EpisodeQuery>
}

const EpisodeContent: React.FC<EpisodeContentProps> = ({ initialQueryRef }) => {
  const data = usePreloadedQuery<EpisodeQuery.EpisodeQuery>(
    graphql`
      query EpisodeQuery($episodeId: Int!) {
        episode(identifier: $episodeId) {
          identifier
          podcast {
            ...PodcastHeader_podcast
          }
          ...EpisodeHeader_episode
          ...DownloadList_episodeDownloadQuery
        }
        ...CallListQuery @arguments(first: 10, episodeIdentifier: $episodeId)
      }
    `,
    initialQueryRef,
  )

  if (!data.episode) {
    return <p>Unknown episode.</p>
  }

  return (
    <Page
      title={<PodcastHeader className='mb-4' data={data.episode.podcast} />}
    >
      <Card>
        <EpisodeHeader className='' data={data.episode} />
      </Card>
      <Card title='Calls'>
        <CallList data={data} episodeIdentifier={data.episode.identifier} />
      </Card>
      <Card title='Episode fetches'>
        <DownloadList data={data.episode} />
      </Card>
    </Page>
  );
}

export const Episode: React.FC = () => {
  const data = useLoaderData() as any;
  return (
    <React.Suspense
      fallback={<p>Loading</p>}
    >
      <Await
        resolve={data.loadQuery}
        errorElement={<p>Error loading.</p>}
      >
        {(ref) => <EpisodeContent initialQueryRef={ref} />}
      </Await>
    </React.Suspense>
  );
}
