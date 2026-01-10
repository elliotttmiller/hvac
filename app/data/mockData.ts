import { Project, Blueprint } from '../types';

export const MOCK_PROJECTS: Project[] = [
  { id: 'proj-01', name: 'ASHRAE HQ Retrofit', blueprints: 12, status: 'active', lastUpdated: '10m ago' },
  { id: 'proj-02', name: 'City Center Mall', blueprints: 45, status: 'active', lastUpdated: '2h ago' },
  { id: 'proj-03', name: 'Northside Hospital', blueprints: 8, status: 'archived', lastUpdated: '4d ago' },
];

export const MOCK_BLUEPRINTS: Blueprint[] = [
  { id: 'bp-101', name: 'Level 2 - VAV Layout', status: 'processed', compliance: 92 },
  { id: 'bp-102', name: 'Mechanical Room B', status: 'processing', compliance: 0 },
  { id: 'bp-103', name: 'Ductwork Risers', status: 'queued', compliance: 0 },
];
