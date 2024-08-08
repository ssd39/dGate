require("dotenv").config();
const express = require("express");
const { expressjwt } = require("express-jwt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const yaml = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const { Routes, REST } = require("discord.js");
const discord_client = require("./discord_utils/client");
const Subscription = require("./models/Subscription");
const {
  Asset,
  BASE_FEE,
  Horizon,
  Keypair,
  Memo,
  Networks,
  NotFoundError,
  Operation,
  TransactionBuilder,
} = require("diamante-sdk-js");
const Subscribers = require("./models/Subscribers");
const Transaction = require("./models/Transaction");
const app = express();
const port = 3001 || process.env.PORT;
const dashRouter = express.Router();
const swaggerDocument = yaml.load("./swagger.yaml");

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(
  "/dashboard",
  (req, res, next) => {
    const handleErrorNext = (err) => {
      if (err) {
        if (
          err.name === "UnauthorizedError" &&
          err.inner.name === "TokenExpiredError"
        ) {
          return res
            .status(403)
            .json({ message: "Login expired!", loginRequired: true });
        }
      }
      next(err);
    };
    const middleware = expressjwt({
      secret: process.env.JWT_SECRET,
      algorithms: ["HS256"],
    });

    middleware(req, res, handleErrorNext);
  },
  dashRouter
);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});

app.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ email, password, name });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "720h",
    });
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    console.log(user);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

dashRouter.get("/me", async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findOne({ _id: userId }, { password: 0 });
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

/*dashRouter.get("/discord_guilds", async (req, res) => {
  try {
    const userId = req.auth.userId;
    const discord = await Discord.findOne({ owner: userId });
    if (!discord)
      return res.status(404).json({ message: "Discord data not found" });

    const client = discord_client.getClient("oXxLoumRZ2aPV1cw4t0G7HYS1ruKLU");
    const userGuilds = (await client.get(Routes.userGuilds())).filter(
      (v) => v.owner
    );
    res.json({ userGuilds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});*/

dashRouter.post("/discord_connect", async (req, res) => {
  try {
    const code = req.body.code;
    if (!code) {
      return res.status(401).json({ message: "auth code required!" });
    }
    const token = await discord_client.getToken(
      code,
      process.env.REDIRECT_URI_BOT
    );
    res.json(token);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/discord_connect_sub", async (req, res) => {
  try {
    const code = req.body.code;
    if (!code) {
      return res.status(401).json({ message: "auth code required!" });
    }
    const token = await discord_client.getToken(
      code,
      process.env.REDIRECT_URI_SUBSCRIBE
    );
    const rest = new REST({ version: "10", authPrefix: "Bearer" }).setToken(
      token.access_token
    );
    const meData = await rest.get(Routes.user());
    res.json({ ...token, ...meData });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

dashRouter.get("/discord_channels/:guildId", async (req, res) => {
  try {
    const guildId = req.params.guildId;
    const client = discord_client.getClient(process.env.DISCORD_BOT_TOKEN);
    const userChannels = await client.get(Routes.guildChannels(guildId));
    res.json({ userChannels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

dashRouter.get("/list_subscription", async (req, res) => {
  try {
    const userId = req.auth.userId;
    const subscriptions = await Subscription.find({ owner: userId });
    console.log(subscriptions);
    res.json({ subscriptions });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

dashRouter.post("/create_subscription", async (req, res) => {
  const userId = req.auth.userId;
  const {
    name,
    amount,
    token,
    description,
    durationType,
    durationCount,
    guildId,
    isChannelBase,
    channelList,
    constrains,
    walletAddress,
  } = req.body;
  try {
    const subscription = new Subscription({
      owner: userId,
      name,
      amount,
      token,
      walletAddress,
      description,
      durationType,
      durationCount,
      isChannelBase,
      guildId,
      channelList,
      constrains,
    });
    await subscription.save();
    res.status(200).json({ message: "Subscription created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/subscription/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const subscription = await Subscription.findById(id);
    res.json({ subscription });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/subscribe", async (req, res) => {
  try {
    const {
      subId,
      txHash,
      discordId,
      email,
      access_token,
      memo,
      discordInternalID
    } = req.body;
    const subscription = await Subscription.findById(subId);
    const txRes = await fetch(
      `https://diamtestnet.diamcircle.io/transactions/${txHash}`
    );
    const txData = await txRes.json();
    if (txData.memo != memo) {
      res.status(401).json({ message: "Wrong transaction proof submitted!" });
      return;
    }
    const opRes = await fetch(
      `https://diamtestnet.diamcircle.io/transactions/${txHash}/operations`
    );
    const opData = await opRes.json();
    const amnt = Number(opData._embedded.records[0].amount);
    if (amnt < subscription.amount) {
      res
        .status(401)
        .json({ message: "Amount is lessthen subscription fees!" });
      return;
    }
    const walletAddress = subscription.walletAddress;
    let txD = "";
    if (walletAddress) {
      const server = new Horizon.Server("https://diamtestnet.diamcircle.io/");
      const pair = Keypair.fromSecret(process.env.WALLET_PK);
      const account = await server.loadAccount(pair.publicKey());
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.payment({
            destination: walletAddress,
            asset:
              subscription.token == "DIAM"
                ? Asset.native()
                : new Asset(subscription.token),
            amount: subscription.amount.toString(),
          })
        )
        .setTimeout(180)
        .build();
      transaction.sign(pair);
      // And finally, send it off to Diamante!
      txD = await server.submitTransaction(transaction);
    }
   
    const client = discord_client.getClient(process.env.DISCORD_BOT_TOKEN);
    const disaddRes = await client.put(
      Routes.guildMember(subscription.guildId, discordInternalID),
      { body: { access_token } }
    );
    console.log(JSON.stringify(disaddRes))
    console.log(discordInternalID)
    const subscriber = new Subscribers({
      discordId,
      discordInternalId: discordInternalID,
      email,
      joinedOn: new Date(),
      lastPaidAt: new Date(),
      subId,
    });
    await subscriber.save();
    const subscriberId = subscriber._id;
    const transaction = new Transaction({
      amount: amnt,
      chain: "DIMANTE",
      subId,
      txHash,
      subscriber: subscriberId,
      token: subscription.token,
    });
    await transaction.save();
    res.json({ message: "Added to server successfully!" });
  } catch (e) {
    console.error(e);
    console.log(JSON.stringify(e))
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/discord_auth", (req, res) => {
  res.json({ url: process.env.DISCORD_LOGIN_URL });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
