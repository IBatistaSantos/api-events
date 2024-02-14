interface Props {
  sessionId: string;
  payload: {
    eventId: string;
    date: string;
  };
}

export class FinishSessionEvent {
  constructor(public readonly props: Props) {}
}
