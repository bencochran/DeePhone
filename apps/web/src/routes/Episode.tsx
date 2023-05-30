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
        callCount
      }
    `,
    data
  );

  return <p>{episode.title} {episode.callCount > 0 && <em>{episode.callCount} {episode.callCount === 1 ? 'call' : 'call'}</em>}</p>;
}
