import { Router } from "express";
import { Controllers } from "../controllers";

function routes(controllers: Controllers) {
  const router = Router();

  // Webhook
  router.post("/feedback", controllers.feedbackController.handle);

  return router;
}

export { routes };
