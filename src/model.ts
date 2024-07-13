import * as tf from '@tensorflow/tfjs';
import { Chess } from './Chess.ts';

tf.setBackend('cpu');
await tf.ready();

export async function train(model: tf.Sequential, episodes: number) {
  for (let episode = 0; episode < episodes; episode++) {
    let game = new Chess();  // Your Chess class instance
    let states: any = [];
    let actions: any = [];
    let rewards: Array<number> = [];
    let currentSide: boolean = true;  // Track the current side

    while (!game.isGameOver()) {
      let currentSide = game.whiteMove;
      const boardState = game.getBoardState();  
      const stateTensor = tf.tensor(boardState, [1, 8, 8, 12]);

      // Predict move probabilities
      const moveProbabilities = model.predict(stateTensor) as tf.Tensor;

      // Get legal moves and apply mask
      const legalMovesMask = game.getLegalMovesMask();  
      const maskedMoveProbabilities = moveProbabilities.mul(legalMovesMask);
      const maskedMoveProbabilitiesArray = await maskedMoveProbabilities.data();
      
      // Choose the move with the highest probability
      let maxIndex = 0;
      let maxValue = -Infinity;

      for (let i = 0; i < maskedMoveProbabilitiesArray.length; i++) {
        if (maskedMoveProbabilitiesArray[i] > maxValue) {
          maxValue = maskedMoveProbabilitiesArray[i];
          maxIndex = i;
        }
      }

      // Perform the move
      game.makeMove(maxIndex);  

      // Store the state, action, and current side
      states.push({ stateTensor: stateTensor.squeeze(), currentSide });
      actions.push(maxIndex);

      // Toggle the side
      currentSide = !currentSide;
    }
    
    // Get the game result
    const result = game.calculateWinner();  // Implement this method
    console.log(`Game #: ${episode}`);
    console.log(result)
    console.log(game);

    // Assign rewards based on the result
    let whiteReward = 0;
    let blackReward = 0;
    if (result === 'white') {
      whiteReward = 1;
      blackReward = -1;
    } else if (result === 'black') {
      whiteReward = -1;
      blackReward = 1;
    } else if (result === 'draw') {
      whiteReward = 0.5;
      blackReward = 0.5;
    }

    // Compute rewards for each step
    for (let i = 0; i < states.length; i++) {
      const { stateTensor, side } = states[i];
      const reward = side ? whiteReward : blackReward;
      rewards.push(reward);
    }

    // Compute the discounted rewards and train the model
    const discountedRewards = computeDiscountedRewards(rewards);
    const statesTensor = tf.stack(states.map(s => s.stateTensor));
    const actionsTensor = tf.tensor(actions, [actions.length, 1], 'int32');
    const rewardsTensor = tf.tensor(discountedRewards, [discountedRewards.length, 1]);

    // One-hot encode the actions tensor
    const oneHotActionsTensor = tf.oneHot(actionsTensor, 4096).squeeze();

    // Update the model
    await model.fit(statesTensor, oneHotActionsTensor.mul(rewardsTensor), {
      epochs: 1,
      batchSize: 32
    });
  }
}

export async function playMove(model: tf.Sequential, game: Chess): Promise<Chess> {
  const boardState = game.getBoardState();
  const stateTensor = tf.tensor(boardState, [1, 8, 8, 12]);

  // Predict move probabilities
  const moveProbabilities = model.predict(stateTensor) as tf.Tensor;

  // Get legal moves and apply mask
  const legalMovesMask = game.getLegalMovesMask();
  const maskedMoveProbabilities = moveProbabilities.mul(legalMovesMask);
  const maskedMoveProbabilitiesArray = await maskedMoveProbabilities.data();

  // Choose the move with the highest probability
  let maxIndex = 0;
  let maxValue = -Infinity;

  for (let i = 0; i < maskedMoveProbabilitiesArray.length; i++) {
    if (maskedMoveProbabilitiesArray[i] > maxValue) {
      maxValue = maskedMoveProbabilitiesArray[i];
      maxIndex = i;
    }
  }

  // Perform the move
  game.makeMove(maxIndex);
  return game;
}

function computeDiscountedRewards(rewards: number[], discountFactor = 0.99): number[] {
  const discountedRewards: Array<number> = [];
  let cumulativeReward = 0;
  for (let i = rewards.length - 1; i >= 0; i--) {
    cumulativeReward = rewards[i] + (cumulativeReward * discountFactor);
    discountedRewards.unshift(cumulativeReward);
  }
  return discountedRewards;
}

export function initializeModel(): tf.Sequential {
  const model = tf.sequential();

  model.add(tf.layers.conv2d({
    inputShape: [8, 8, 12],
    filters: 32,
    kernelSize: 3,
    activation: 'relu',
    padding: 'same'
  }));

  model.add(tf.layers.conv2d({
    filters: 64,
    kernelSize: 3,
    activation: 'relu',
    padding: 'same'
  }));

  model.add(tf.layers.flatten());

  model.add(tf.layers.dense({
    units: 2048,
    activation: 'relu'
  }));

  model.add(tf.layers.dense({
    units: 4096,
    activation: 'softmax'
  }));

  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy'
  });

  return model;
}
