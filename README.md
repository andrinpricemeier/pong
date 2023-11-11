# Pong

## AI

### Up-Down AI

The UpDownAI does nothing more than move up and down without any purpose.

### Predictive AI

The predictive AI uses Machine Learning a model trained on data based on real human players.
The input is [ball.x, ball.y, ball direction x, ball direction y, paddle y] and the output is a vector of classes: do-nothing, go up, go down.
The model uses a small neuronal network and a softmax output layer.

The data was gathered by using an API hosted on AWS, stored in an S3 bucket. The project can be viewed live on: https://prod.dw9cvqwfy32oj.amplifyapp.com/.
#### Training

1. Train model
1. Convert to tfjs model using script

