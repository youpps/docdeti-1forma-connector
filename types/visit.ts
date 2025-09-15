enum VisitType {
  Nurse = "nurse",
  Doctor = "doctor",
}

enum VisitFeedbackType {
  Positive = "positive",
  Negative = "negative",
  Nopurpose = "nopurpose",
  Warning = "warning",
  Commercial = "commercial",
}

interface IVisit {
  id: number;
  parent: string;
  child: string;
  type: VisitType;
  recordUrl: string;
  processedAt: Date;
  date: Date;
  phone: string;
  comment: string;
  doctor: string;
  address: string;
  isLast: 1 | 0;
}

export { IVisit, VisitFeedbackType, VisitType };
