import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FingerprintRule { id: number; name: string; score: number; status: 'Ativo'|'Inativo'; }

@Component({
  selector: 'app-fingerprint-score-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fingerprint-score-config.html',
  styleUrls: ['../dashboard/dashboard.scss']
})
export class FingerprintScoreConfig {
  readonly q = signal('');
  private readonly data = signal<FingerprintRule[]>([
    { id: 1, name: 'Its newlocality', score: 10, status: 'Ativo' },
    { id: 2, name: 'Its newdevice',   score: 30, status: 'Ativo' },
    { id: 3, name: 'Its newip',       score: 20, status: 'Inativo' },
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

  trackBy = (_: number, r: FingerprintRule) => r.id;
  edit(r: FingerprintRule) { alert(`Editar fingerprint: ${r.name}`); }
}