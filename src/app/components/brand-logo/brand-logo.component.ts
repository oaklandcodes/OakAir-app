import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brand-logo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './brand-logo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandLogoComponent {
  readonly stacked = input(false);
  readonly showTagline = input(false);
  readonly compact = input(false);
  readonly linkToDashboard = input(true);
}
