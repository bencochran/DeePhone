import React from 'react';

import { graphql, useFragment } from 'react-relay';
import { Episode_episode$key } from './__generated__/Episode_episode.graphql';

interface Props {
  data: Episode_episode$key;
}

export const Episode: React.FC<Props> = ({ data }) => {
  const episode = useFragment(
    graphql`
      fragment Episode_episode on Episode {
        title
        imageURL
        callCount
      }
    `,
    data
  );

  return <p>{episode.imageURL && <img src={episode.imageURL} height='100px'/>}{episode.title} {episode.callCount > 0 && <em>{episode.callCount} {episode.callCount === 1 ? 'call' : 'calls'}</em>}</p>;
}
