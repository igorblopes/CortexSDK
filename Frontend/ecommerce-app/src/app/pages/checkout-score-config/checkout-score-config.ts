import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CheckoutRule { id: number; name: string; score: number; status: 'Ativo'|'Inativo'; }

@Component({
  selector: 'app-checkout-score-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-score-config.html',
  styleUrls: ['../dashboard/dashboard.scss']
})
export class CheckoutScoreConfig {
  readonly q = signal('');
  private readonly data = signal<CheckoutRule[]>([
    { id: 1, name: 'Items types never purchased before',     score: 10, status: 'Ativo'   },
    { id: 2, name: 'Quantity items never purchased before',  score: 30, status: 'Ativo'   },
    { id: 3, name: 'Total value 30% of purchase above mean', score: 20, status: 'Inativo' },
  ]);

  readonly rows = computed(() => {
    const t = this.q().trim().toLowerCase();
    if (!t) return this.data();
    return this.data().filter(r =>
      String(r.id).includes(t) ||
      r.name.toLowerCase().includes(t) ||
      String(r.score).includes(t) ||
      r.status.toLowerCase().includes(t)
    );
  });

  trackBy = (_: number, r: CheckoutRule) => r.id;
  edit(r: CheckoutRule) { alert(`Editar checkout: ${r.name}`); }
}