import { Repositories } from "../repositories";
import { FeedbackController } from "./feedbackController";

class Controllers {
  public feedbackController: FeedbackController;

  constructor(repositories: Repositories) {
    this.feedbackController = new FeedbackController(repositories);
  }
}

export { Controllers };
