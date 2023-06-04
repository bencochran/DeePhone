import { buildBuilder } from '../builder';
import { addPodcastToBuilder } from './Podcast';
import { addEpisodeToBuilder } from './Episode';
import { addEpisodeDownloadToBuilder } from './EpisodeDownload';
import { addEpisodePartToBuilder } from './EpisodePart';
import { addCallToBuilder } from './Call';
import { addCallEventToBuilder } from './CallEvent';

export function addTypesToBuilder(builder: ReturnType<typeof buildBuilder>) {
  const Podcast = addPodcastToBuilder(builder);
  const Episode = addEpisodeToBuilder(builder);
  const EpisodeDownload = addEpisodeDownloadToBuilder(builder);
  const EpisodePart = addEpisodePartToBuilder(builder);
  const Call = addCallToBuilder(builder);
  const CallEvent = addCallEventToBuilder(builder);
  return {
    Podcast,
    Episode,
    EpisodeDownload,
    EpisodePart,
    Call,
    CallEvent,
  };
}

export type Types = ReturnType<typeof addTypesToBuilder>;
