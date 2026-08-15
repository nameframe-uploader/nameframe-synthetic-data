# Barnyard synthetic dataset

Barnyard is a NameFrame inspection sample for small-object detection from near-nadir, low-altitude viewpoints.

## Source run

| Field | Value |
| --- | --- |
| Map | `Map_BarnEnvironment` |
| Engine | Unreal Engine 5.8 |
| Source run | 300 frames, 14,962 labelled instances |
| Packaged sample | 12 frames, 732 labelled instances |
| Resolution | 1280×960 |
| Seed | 20260814 |
| Classes | person, redbarrel, traffic_cone, box, haybayle, tractor, bucket |
| Camera policy | Near-nadir views from 18 to 45 metres altitude |
| Reported validator result | [C · 78.3/100](https://getnameframe.com/datasets/barnyard) |
| Last verified | 2026-08-15 |

## Formats

The recorded public pack manifest describes RGB, YOLO boxes, COCO instances, per-instance ID buffers, sanitised per-frame metadata and validation reports. Metric-depth data is not listed in this Barnyard distribution.

## Known limitations

- Near-duplicate frames landed in different splits. The validator penalised the split leakage.
- The class distribution is imbalanced enough to receive a validator penalty.
- Near-nadir, low-altitude capture intentionally limits viewpoint diversity and produces small objects.
- Twelve packaged frames from a three-hundred-frame run are an inspection sample, not a benchmark.
- The configured official archive returned HTTP 404 on 2026-08-15. Its recorded hash is retained for provenance, but this page does not present a working download button.

## Recorded distribution

| Distribution | Frames | Instances | Size | SHA-256 | Status |
| --- | ---: | ---: | ---: | --- | --- |
| Barnyard aerial sample v1 | 12 | 732 | 25 MB | `f1828d704a9e9577cba8296c73e5b1ea2311d9e4b4a4d55a54e9dce5559080e6` | Publication pending; configured URL unavailable |

## Licensing and third-party content

[NameFrame sample-data terms](../../DATA_TERMS.md) apply. The depicted Unreal environment and prop content may remain subject to separate third-party licence restrictions. Downloading a future sample will not grant rights to extract or reuse depicted third-party assets.

## Citation

> NameFrame. Barnyard synthetic dataset, version 1.0, Map_BarnEnvironment, seed 20260814 (2026).
