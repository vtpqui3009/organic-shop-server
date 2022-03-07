const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// exports.stripePayment = async (req, res, next) => {
//   stripe.customers
//     .create({
//       email: email,
//       source: token.id,
//       name: token.card.name,
//     })
//     .then((customer) => {
//       return stripe.charges.create({
//         amount: parseFloat(amount) * 100,
//         description: `Payment for USD ${amount}`,
//         currency: "USD",
//         customer: customer.id,
//       });
//     })
//     .then((charge) => res.status(200).send(charge))
//     .catch((err) => console.log(err));

//   // stripe.charges.create(
//   //   {
//   //     source: req.body.tokenId,
//   //     amount: req.body.amount,
//   //     currency: "usd",
//   //   },
//   //   (stripeErr, stripeRes) => {
//   //     if (stripeErr) {
//   //       res.status(500).json(stripeErr);
//   //     } else {
//   //       res.status(200).json(stripeRes);
//   //     }
//   //   }
//   // );
// };
exports.stripePayment = async (req, res) => {
  const domainURL = process.env.WEB_APP_URL;
  const { line_items, customer_email } = req.body;
  if (!line_items || !customer_email) {
    return res
      .status(400)
      .json({ error: "missing required session parameters" });
  }
  let session;
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      customer_email,
      success_url: `${domainURL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/canceled`,
      shipping_address_collection: { allowed_countries: ["GB", "US"] },
    });
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "an error occured, unable to create a session" });
  }
};
