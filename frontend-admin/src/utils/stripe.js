import { loadStripe } from '@stripe/stripe-js';

let stripePromise = null;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      'pk_live_51KFBDFArPLlrj33heO8eNwVgiWW7P4GqI03xlaJ3wn9PD9DyXa0N2cCsOKftS8ay8FoK2V2raRmuJbHzZFfziEaI00mqFXCQpc',
    );
  }
  return stripePromise;
};

export default getStripe;
