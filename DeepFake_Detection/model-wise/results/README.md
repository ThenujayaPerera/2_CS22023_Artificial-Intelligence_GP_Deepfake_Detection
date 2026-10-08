# Model-wise result folders

Each folder contains the available artifacts for one experiment: graphs,
training histories, evaluation reports, metrics, checkpoints, and saved models.
The original source locations remain in the project and the archived snapshots
remain under `archive/`.

| Folder | Experiment |
|---|---|
| `E01_baseline_224x224/` | E1 baseline CNN |
| `E02_augmentation_224x224/` | E2 baseline CNN with augmentation |
| `E03_cnn_128x128/` | E3 reduced-resolution CNN |
| `E04_cnn_256x256/` | E4 standard CNN and E4-Ext extended variant (`standard/`, `extended/`) |
| `E05_cnn_128_batchnorm/` | E5 BatchNorm CNN |
| `E06_cnn_128_batchnorm_variant/` | E6 recorded BatchNorm variant |
| `E07_batchnorm_dropout03/` | E7 BatchNorm + Dropout 0.3 |
| `E08_deeper_batchnorm/` | E8 deeper BatchNorm CNN |
| `E09_efficientnetb0_128/` | E9 EfficientNetB0 |
| `E10_regularized_cnn/` | E10 Dropout 0.5 + L2 |

Keras files are binary model files and should be loaded with TensorFlow/Keras,
not opened as text. CSV, JSON, TXT, and PNG files are the human-readable
training and evaluation outputs.

## Notebook-embedded graphs

The `graphs/notebook_outputs/` directory inside each result folder contains
the PNG/JPEG images that were already embedded in the corresponding
model-wise notebook. This preserves graphs that were displayed with
`plt.show()` but were not saved by the original notebook. E8, for example,
now includes the embedded test confusion matrix and threshold-analysis plots
alongside its saved training graphs.
