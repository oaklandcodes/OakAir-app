import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-form-submit-button',
  standalone: true,
  templateUrl: './form-submit-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSubmitButtonComponent {
  readonly label = input.required<string>();
  readonly loadingLabel = input<string | null>(null);
  readonly loading = input(false);
  readonly disabled = input(false);
  readonly fullWidth = input(true);
  readonly trailingIcon = input<string | null>('✨');
  readonly size = input<'default' | 'large'>('default');

  readonly buttonText = computed(() => {
    if (this.loading() && this.loadingLabel()) {
      return this.loadingLabel() ?? this.label();
    }
    return this.label();
  });

  readonly sizeClasses = computed(() =>
    this.size() === 'large'
      ? 'py-5 px-8 text-xs'
      : 'py-4 px-6 text-[11px]',
  );
}
