# Airbase synthetic dataset

Airbase is a NameFrame inspection sample for aerial object detection and instance segmentation in a cluttered ground scene.

## Source run

| Field | Value |
| --- | --- |
| Map | `Map_Airbase_Demo` |
| Engine | Unreal Engine 5.8 |
| Source run | 40 frames, 4,378 labelled instances |
| Packaged sample | 13 unique frames across two archives; 15 archive frame records |
| Resolution | 1920×1080 |
| Seed | 67 |
| Classes | person, car, tank, container, crate, barrel |
| Camera policy | Four authored camera zones looking at one target, with scene weather |
| Reported validator result | [A · 92.4/100](https://getnameframe.com/datasets/airbase) |
| Last verified | 2026-08-15 |

The detection archive contains 12 frames and 1,813 annotations. The every-modality archive contains 3 frames and 562 annotations. Two frames occur in both archives, so adding those archive totals does not produce a unique-frame count.

## Formats

RGB, YOLO boxes, COCO instances, per-instance ID buffers, sanitised per-frame metadata and validation reports are represented. The every-modality distribution also includes metric float32 depth arrays.

## Known limitations

- The verification pass reported three visible people without a published bounding box among ninety people inspected. The failing check is retained in the sample report.
- The four camera zones cover a narrow band of viewing angles and distances.
- The class distribution is uneven because the source scene is uneven.
- Thirteen unique packaged frames from a forty-frame run are an inspection sample, not a benchmark.

## Official distributions

| Distribution | Frames | Instances | Size | SHA-256 | Download |
| --- | ---: | ---: | ---: | --- | --- |
| Detection sample v1 | 12 | 1,813 | 49 MB | `ac54025db5789bc58e62a54474b3c0ced5563a64c984baf01e155a7e71f17f94` | [Official ZIP](https://datasets.getnameframe.com/nameframe-airbase-detection-v1.zip) |
| Every-modality sample v1 | 3 | 562 | 14 MB | `c52922f1ee9db49abd42e00b3ddc25f19dfea83bd4ac0ad01362267d90769f22` | [Official ZIP](https://datasets.getnameframe.com/nameframe-airbase-modalities-v1.zip) |

## Licensing and third-party content

[NameFrame sample-data terms](../../DATA_TERMS.md) apply. The depicted Unreal environment and prop content may remain subject to separate third-party licence restrictions. Downloading the sample does not grant rights to extract or reuse depicted third-party assets.

## Citation

> NameFrame. Airbase synthetic dataset, version 1.0, Map_Airbase_Demo, seed 67 (2026).
