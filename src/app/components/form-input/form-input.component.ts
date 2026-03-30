import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormInputComponent {
  readonly label = input.required<string>();
  readonly control = input.required<FormControl<string>>();
  readonly type = input('text');
  readonly placeholder = input('');
  readonly icon = input('');
  readonly autocomplete = input<string | null>(null);

  readonly resolvedAutocomplete = computed(() => {
    if (this.autocomplete()) {
      return this.autocomplete();
    }

    if (this.type() === 'email') {
      return 'email';
    }

    if (this.type() === 'password') {
      return 'current-password';
    }

    return 'off';
  });

  readonly displayError = computed(() => {
    const control = this.control();
    if (!control.touched) return null;

    return control.errors?.['apiError'] ?? null;
  });
}
