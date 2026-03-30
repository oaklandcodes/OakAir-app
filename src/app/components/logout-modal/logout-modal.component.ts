import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-logout-modal',
  imports: [],
  templateUrl: './logout-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutModal {
  // Recibe la orden del padre para abrirse o cerrarse.
  readonly isOpen = input<boolean>(false);

  readonly onConfirm = output<void>();
  readonly onCancel = output<void>();

  handleConfirm(): void {
    this.onConfirm.emit();
  }

  handleCancel(): void {
    this.onCancel.emit();
  }
}
