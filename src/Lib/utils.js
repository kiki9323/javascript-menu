import OutputView from '../View/OutputView.js';

export const inputWithRetry = async (inputMethod, retryCount = 3) => {
  try {
    return await inputMethod();
  } catch (error) {
    if (retryCount === 0) throw new Error('End');
    OutputView.printError(error);
    return await inputWithRetry(inputMethod, retryCount - 1);
  }
};
