import React from 'react';

import { graphql, useFragment } from 'react-relay';
import { Podcast_podcast$key } from './__generated__/Podcast_podcast.graphql';

import { Episode } from './Episode';

interface Props {
  data: Podcast_podcast$key;
}

export const Podcast: React.FC<Props> = ({ data }) => {
  const podcast = useFragment(
    graphql`
      fragment Podcast_podcast on Podcast {
        title
        imageURL
        episodes(first: 10) {
          edges {
            node {
              id
              ...Episode_episode
            }
          }
        }
      }
    `,
    data
  );

  return (
    <div>
      <p>{podcast.title}</p>
      {podcast.imageURL && <img src={podcast.imageURL} height='100px'/>}
      <ul>
        {podcast.episodes.edges.map(edge =>
          edge && <Episode key={edge.node.id} data={edge.node} />
        )}
      </ul>
    </div>
  )
}
