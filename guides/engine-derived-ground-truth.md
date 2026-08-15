# Engine-derived ground truth

Synthetic-data tooling can record information that the rendering engine already knows, including object identity and per-pixel distance. Those signals make aligned annotations possible, but they do not make every exported label infallible.

Visibility thresholds, instance-ID neighbourhoods, thin geometry, occlusion rules, post-processing, filtering decisions and packaging defects can all affect a derived annotation. A responsible dataset therefore publishes validation evidence and limitations instead of describing its labels as perfect.

For each sample:

- identify which outputs are rendered, recorded or derived;
- compare them on the same frame;
- inspect distant, thin, partially occluded and cropped objects;
- retain failed checks in the report;
- validate fitness for the downstream task independently.
