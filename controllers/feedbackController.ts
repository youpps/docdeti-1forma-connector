import { Request, Response } from "express";
import Joi from "joi";
import { Repositories } from "../repositories";
import { Status } from "../types/status";
import { VisitFeedbackType } from "../types/visit";
import { VisitDialogMessageSender } from "../types/visitDialogMessage";

class FeedbackController {
  constructor(private repositories: Repositories) {}

  handle = async (req: Request, res: Response) => {
    try {
      const dialogSchema = Joi.object({
        text: Joi.string().min(1).required(),
        sender: Joi.valid(VisitDialogMessageSender.Bot, VisitDialogMessageSender.User).required(),
      });

      const bodySchema = Joi.object({
        type: Joi.valid(VisitFeedbackType.Negative).required(),
        summary: Joi.string().min(1).required(),
        dialog: Joi.array().min(1).items(dialogSchema),
        phone: Joi.string().min(1).required(),
        date: Joi.date().required(),
        fullname: Joi.string().min(1).required(),
      });

      const { error: bodyError, value: body } = bodySchema.validate(req.body);

      if (bodyError) {
        console.log(bodyError);

        return res.status(400).json({
          status: Status.Error,
          data: { message: bodyError?.message },
        });
      }

      const isSent = await this.repositories.oneFormaRepository.saveFeedback({
        date: body.date,
        phone: body.phone,
        fullname: body.fullname,
        dialog: body.dialog,
        summary: body.summary,
      });

      if (!isSent) {
        return res.status(500).json({
          status: Status.Error,
          data: { message: "Feedback has not been saved to Google Sheets" },
        });
      }

      return res.status(200).json({
        status: Status.Success,
        data: { message: "Feedback has not been saved to Google Sheets" },
      });
    } catch (e) {
      console.log(e);

      return res.status(500).json({
        status: Status.Error,
        data: { message: "Internal server error" },
      });
    }
  };
}

export { FeedbackController };
