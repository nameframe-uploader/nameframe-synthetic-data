import { readFileSync } from 'node:fs';
import path from 'node:path';

export type Distribution = {
  name: string;
  version: string;
  frames: number;
  labelled_instances: number;
  size_bytes: number;
  size_label: string;
  sha256: string;
  official_download_url: string;
  download_status: 'available' | 'pending_publication';
};

export type DatasetCard = {
  schema_version: string;
  slug: string;
  name: string;
  version: string;
  purpose: string;
  engine: string;
  map: string;
  seed: number;
  source_run: { frames: number; labelled_instances: number; resolution: [number, number] };
  packaged_sample: {
    unique_frames: number;
    archive_frame_records: number;
    labelled_instances_across_archives: number;
    note: string;
  };
  classes: string[];
  formats: string[];
  camera_policy: string;
  grade: { letter: string; score: number };
  report_url: string;
  limitations: string[];
  distributions: Distribution[];
  preview: {
    frame_id: string;
    downscaled: boolean;
    rgb: string;
    boxes: string;
    instances: string;
    depth: string | null;
  };
  licensing: string;
  citation: string;
  official_page: string;
  last_verified: string;
};

const workingDirectory = process.cwd();
const repositoryRoot = path.basename(workingDirectory) === 'site'
  ? path.resolve(workingDirectory, '..')
  : workingDirectory;
const datasetRoot = path.join(repositoryRoot, 'datasets');
const slugs = ['airbase', 'barnyard'] as const;

export const datasets: DatasetCard[] = slugs.map((slug) =>
  JSON.parse(readFileSync(`${datasetRoot}/${slug}/dataset-card.json`, 'utf8')) as DatasetCard
);

export function getDataset(slug: string): DatasetCard | undefined {
  return datasets.find((dataset) => dataset.slug === slug);
}

export function withBase(path = '/') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const normalised = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalised}`.replace(/\/+/g, '/');
}

export function previewUrl(dataset: DatasetCard, key: 'rgb' | 'boxes' | 'instances' | 'depth') {
  const filename = dataset.preview[key];
  if (!filename) return null;
  return withBase(`/previews/${dataset.slug}/${filename.split('/').at(-1)}`);
}
