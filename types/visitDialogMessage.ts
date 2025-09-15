enum VisitDialogMessageSender {
  Bot = "bot",
  User = "user",
}

interface IVisitDialogMessage {
  text: string;
  sender: VisitDialogMessageSender;
}

export { IVisitDialogMessage, VisitDialogMessageSender };
