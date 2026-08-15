# Representative YOLO label

`example-label.txt` is a sanitised, illustrative detection label for a 1920×1080 frame. Each row uses the common five-column form:

```text
class_id x_center y_center width height
```

Coordinates are normalised to `[0, 1]`. The example is not copied from a production manifest and does not define the private NameFrame pipeline schema.

| Class ID | Label |
| ---: | --- |
| 0 | person |
| 1 | car |
| 2 | tank |

Before training, verify the class mapping shipped with the specific dataset archive.
