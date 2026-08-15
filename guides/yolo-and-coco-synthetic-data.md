# YOLO and COCO synthetic-data exports

YOLO detection labels commonly encode `class_id x_center y_center width height`, with coordinates normalised to image dimensions. COCO uses explicit image, category and annotation records; boxes are normally `[x, y, width, height]` in pixels.

Before using either export:

- confirm the class mapping for the exact archive version;
- confirm image dimensions and frame identity;
- ensure normalised values stay in range;
- resolve every COCO image and category reference;
- inspect boxes and masks against aligned visual outputs;
- avoid assuming that a representative public example exposes the complete production schema.

See the small examples under `samples/yolo` and `samples/coco`.
