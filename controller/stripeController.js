const stripe = require("stripe")(
  "  sk_test_51KRqpcL6Cna0WfUD4smBLejfR0GfbAB2247IF9D5XtepIKTXtzEoTkHCP0eYLIXBnPGw4pgPXLYRjnWIH0iKgJuE00z283u1DO"
);

const createCheckoutSession = async (req, res) => {
  const domainUrl = process.env.WEB_APP_URL;
  console.log(domainUrl);
  const { line_items, customer_email } = req.body;
  if (!line_items || !customer_email) {
    return res
      .status(400)
      .json({ error: "Missing required session parameters" });
  }
  let session;
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      customer_email,
      success_url: `${domainUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainUrl}/canceled`,
      shipping_address_collection: { allowed_countries: ["VN"] },
    });
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "An error occured, unable to create session" });
  }
};
module.exports = createCheckoutSession;
