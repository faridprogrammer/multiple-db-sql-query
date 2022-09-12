import { AlertType } from './AlertType';

export class Alert {
  constructor(public Message: string, public Type: AlertType) { }
  getColor(): string {
    switch (this.Type) {
      case AlertType.Info:
        return 'blue';
      case AlertType.Error:
        return 'red';
      case AlertType.Success:
        return 'green';
      default:
        return '';
    }
  }
}
