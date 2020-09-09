/* Project specific Javascript goes here. */

// Get Stripe publishable key
fetch("/payments/config/")
  .then((result) => {
    return result.json();
  })
  .then((data) => {
    // noinspection JSUnresolvedFunction
    const stripe = Stripe(data.publicKey); // Initialize Stripe.js

    // Event handler
    document.querySelector("#submitBtn").addEventListener("click", () => {
      // Get Checkout Session ID
      fetch("/payments/create-checkout-session/")
        .then((result) => {
          return result.json();
        })
        .then((data) => {
          // Redirect to Stripe Checkout
          // noinspection JSUnresolvedFunction
          return stripe.redirectToCheckout({sessionId: data.sessionId});
        })
        .then((res) => {
          console.log("Results: " + res);
        });
    });
  });

