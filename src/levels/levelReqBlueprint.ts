import type { StoryboardConfig } from '../engine/types';

export const levelReqBlueprint: StoryboardConfig = {
  id: 'level_req_blueprint',
  levelNumber: 1,
  title: 'Level 1: The Blueprint & Scope Framing',
  subtitle: 'Requirements Engineering (Functional vs Non-Functional)',
  description: 'The player is the Boss standing in a muddy empty field. 3D procedural asset pack & turntable preview gallery.',
  unlockedByDefault: true,
  beats: [
    {
      id: 'gallery_intro',
      type: 'cinematic',
      panelNumber: 1,
      panelTitle: 'The Muddy Field',
      caption: 'Boss stands on an empty muddy plot. 10 mixers are idling.',
      speechBubbles: [
        {
          speaker: 'guard',
          text: 'Do we pour the concrete?',
        },
      ],
      autoAdvance: false,
    },
  ],
};
