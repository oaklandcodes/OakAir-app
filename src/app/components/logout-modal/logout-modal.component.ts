import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-logout-modal',
  imports: [],
  templateUrl: './logout-modal.html'
})
export class LogoutModal {

  // recibe la orden del padre para abrirse o cerrarse
isOpen = input<boolean>();

onConfirm = output<void>();
onCancel = output<void>();

handleConfirm() {
  this.onConfirm.emit();
}

handleCancel() {
  this.onCancel.emit();
}

}
