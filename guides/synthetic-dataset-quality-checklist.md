# Synthetic dataset quality checklist

## Integrity

- [ ] Archive size and SHA-256 match the dataset card.
- [ ] Every referenced image and annotation exists.
- [ ] Dimensions and frame identifiers agree across modalities.

## Visual alignment

- [ ] Object edges align across RGB, instance IDs, depth and overlays.
- [ ] Thin, distant, occluded and cropped objects are inspected.
- [ ] Known missed or questionable labels remain visible in the report.

## Coverage

- [ ] Class balance is measured rather than inferred from a montage.
- [ ] Camera distance, elevation and azimuth match the intended domain.
- [ ] Lighting and environment variation are documented.
- [ ] Near-duplicates do not leak across splits.

## Decision

- [ ] The exact dataset version and hash are pinned.
- [ ] Limitations are reconciled with the intended task.
- [ ] Synthetic-only validation is not presented as real-world performance.
