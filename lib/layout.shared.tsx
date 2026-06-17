import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { AviaryWordmark } from '@/components/logo';
import { gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <AviaryWordmark />,
      transparentMode: 'top',
    },
    links: [
      {
        text: 'Field guide',
        url: '/docs',
        active: 'nested-url',
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
