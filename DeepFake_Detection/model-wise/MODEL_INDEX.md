# Model-wise experiment index

This index groups the complete Colab notebooks and generated outputs by model
family. The original five notebooks remain in `../notebooks/`. The model-wise notebooks
in `model-wise/notebooks/` are extracted copies of their cells, including
recorded outputs. They make each experiment independently readable without
removing or modifying the original training notebooks.

## Notebook-to-model mapping

| Experiment | Model/change | Complete notebook | Main output folder |
|---|---|---|---|
| E1 | 224x224 baseline CNN | [E01 notebook](notebooks/E01_baseline_224x224.ipynb) | [E01 results](results/E01_baseline_224x224/) |
| E2 | 224x224 CNN with augmentation | [E02 notebook](notebooks/E02_augmentation_224x224.ipynb) | [E02 results](results/E02_augmentation_224x224/) |
| E3 | 128x128 CNN | [E03 notebook](notebooks/E03_cnn_128x128.ipynb) | [E03 results](results/E03_cnn_128x128/) |
| E4 | 256x256 CNN | [E04 notebook](notebooks/E04_cnn_256x256.ipynb) | [E04 results](results/E04_cnn_256x256/standard/) |
| E4-Ext | Extended 256x256 CNN | [E4-Ext notebook](notebooks/E04_EXT_cnn_256x256_extended.ipynb) | [E04 extended results](results/E04_cnn_256x256/extended/) |
| E5 | 128x128 CNN with BatchNorm | [E05 notebook](notebooks/E05_cnn_128_batchnorm.ipynb) | [E05 results](results/E05_cnn_128_batchnorm/) |
| E6 | Recorded BatchNorm variant | [E06 notebook](notebooks/E06_cnn_128_batchnorm_recorded_variant.ipynb) | [E06 results](results/E06_cnn_128_batchnorm_variant/) |
| E7 | BatchNorm + Dropout 0.3 | [E07 notebook](notebooks/E07_cnn_128_batchnorm_dropout03.ipynb) | [E07 results](results/E07_batchnorm_dropout03/) |
| E8 | Deeper BatchNorm CNN | [E08 notebook](notebooks/E08_cnn_128_deeper_batchnorm.ipynb) | [E08 results](results/E08_deeper_batchnorm/) |
| E9 | EfficientNetB0 transfer learning | [E09 notebook](notebooks/E09_efficientnetb0_128.ipynb) | [E09 results](results/E09_efficientnetb0_128/) |
| E10 | E8 + Dropout 0.5 + L2 regularization | [E10 notebook](notebooks/E10_cnn_128_regularized.ipynb) | [E10 results](results/E10_regularized_cnn/) |

The dataset setup used by every experiment is preserved in
[01_dataset_setup.ipynb](../notebooks/01_dataset_setup.ipynb).

## Reported comparison

The following values are the recorded experiment results supplied with this
project. A dash means that the original record did not report that metric.

| Experiment | Resolution | Test accuracy | Macro F1 | ROC-AUC | Best epoch | Threshold |
|---|---:|---:|---:|---:|---:|---:|
| E1 | 224x224 | 88.37% | 88.25% | 95.20% | 9 | 0.50 |
| E2 | 224x224 | 84.33% | 83.06% | ~93.00% | 10 | 0.50 |
| E3 | 128x128 | 89.56% | 89.46% | 96.37% | 8 | 0.50 |
| E4 | 256x256 | 82.86% | 81.64% | 91.20% | 10 | 0.50 |
| E4-Ext | 256x256 | 84.47% | 83.56% | 92.46% | 12 | 0.50 |
| E5/E6 | 128x128 | 88.24% | 87.31% | 96.62% | 14 | 0.50 |
| E7 | 128x128 | 88.03% | ~87.00% | 96.92% | 7 | 0.50 |
| E8 | 128x128 | **93.12%** | **93.10%** | **98.84%** | 9 | **0.40** |
| E9 | 128x128 | 79.34% | — | 87.94% | — | 0.50 |
| E10 | 128x128 | 92.92% | 92.91% | 98.41% | 15 | 0.50 |

## Selected final model

The recorded comparison identifies **E8 - Deeper BatchNorm CNN** as the
selected final model:

**93.12% test accuracy, 93.10% macro F1, 98.84% ROC-AUC, threshold 0.40.**

The threshold was selected using validation data and then locked before the
final test evaluation. E10 is retained as a strong regularization control
experiment rather than replacing E8.

## Confusion-matrix convention

For all experiments that include a confusion matrix, rows are actual labels
and columns are predicted labels. The project uses `Fake = 0` and `Real = 1`.
The original tables label the cells as TN, FP, FN, and TP accordingly.
