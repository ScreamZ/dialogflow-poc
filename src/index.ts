import * as bodyParser from "body-parser";
import * as express from "express";
import DbManager from "./db";
import IChatResponse from "./IChatResponse";
import Mailer from "./mailer";

// Intents
import { welcomeInit, searchTrainsAction } from "./Intents/main";
import { askPasswordRecovery, checkAccessKey } from "./Intents/user-account";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Init db
const dbManager = new DbManager("database-folder");
const mailer = new Mailer();

/**
 * You can set:
 * - req.speech - For the sentence to be displayed
 * - req.contextOut - For outbound context
 * - req.followupEvent - To dispatch an followup event
 */
app.post("/", async (req, res, next) => {
  const action = req.body.result.action;
  const params = req.body.result.parameters;
  const contexts = req.body.result.contexts;

//  res.setHeader('Content-Type', 'application/json'); 
//  res.send(JSON.stringify({ "speech": "Processing...", "displayText": "Processing..."  }));

  console.log(`=== RECEIVED NEW ACTION : ${action}`);
  // Handle specific job
  switch (action) {
    case "welcome-init":
      welcomeInit(params, dbManager)
        .then(updateRequest(req, next));
      break;
    case "check-access-key":
      checkAccessKey(params, dbManager)
        .then(updateRequest(req, next));
      break;
    case "ask-password-recovery":
      askPasswordRecovery(params, dbManager, mailer)
        .then(updateRequest(req, next));
      break;
    case "search-trains":
      res.json({ "speech": "Je recherche les trajets pour vous...", "displayText": "Processing..."  });
      searchTrainsAction(params, dbManager, contexts, res)
        .then(updateRequest(req, next));
      break;
    default:
      console.error(`NONE ACTION HAVE MATCHED !`);
      next();
  }
});

/**
 * Fill the request with data.
 *
 * @param req - The express request to fill
 * @param nextFunction - The express nextfunction
 */
const updateRequest = (req: express.Request, nextFunction: express.NextFunction): (data: IChatResponse) => void => (
  (data: IChatResponse) => {
    Object.assign(req, data);
    nextFunction(); // Go to the next middleware
  }
);

// Final formatter
app.use((req, res) => {
  const { speech, contextOut, followupEvent } = req as any; // Bypass typings

  res.setHeader("Content-Type", "application/json");
  const data = {
    contextOut,
    displayText: speech,
    followupEvent,
    source: "NodeJS",
    speech,
  };
  console.log("=== SENDING DATA ===");
  console.log(data);
  res.send(data);
});

app.listen(process.env.PORT || 80, () => {
  console.log(`Node app is running on port ${process.env.PORT || 80}`);
});
