import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/** Tipos de registro que o modal sabe editar */
export type Level = 'allow' | 'review' | 'deny';
export type Status = 'Ativo' | 'Inativo';

export type SenseRange = { kind: 'sense', id: number; min_score: number; max_score: number; level: Level };
export type BehaviorRule = { kind: 'behavior', id: number; name: string; score: number; status: Status };
export type FingerprintRule = { kind: 'fingerprint', id: number; name: string; score: number; status: Status };
export type CheckoutRule = { kind: 'checkout', id: number; name: string; score: number; status: Status };

export type Editable =
  | SenseRange
  | BehaviorRule
  | FingerprintRule
  | CheckoutRule;

@Component({
  selector: 'app-rule-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rule-edit-modal.html',
  // Herdamos o mesmo SCSS do dashboard para manter visual idêntico
  styleUrls: ['../dashboard/dashboard.scss', './rule-edit-modal.scss']
})
export class RuleEditModal {
  /** item atual (ou null para não exibir) */
  @Input() set model(value: Editable | null) {
    this._model.set(value ? structuredClone(value) : null);
  }
  /** fechar sem salvar */
  @Output() close = new EventEmitter<void>();
  /** salvar com retorno do registro editado */
  @Output() save = new EventEmitter<Editable>();

  readonly _model = signal<Editable | null>(null);
  readonly visible = computed(() => !!this._model());

  onBackdrop(e: MouseEvent) {
    // fecha ao clicar fora do card
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }

  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') this.close.emit();
  }

  commit() {
    const m = this._model();
    if (!m) return;
    // validações simples
    if (m.kind === 'sense') {
      if (m.min_score > m.max_score) return alert('Min Score não pode ser maior que Max Score.');
    } else {
      if (!m.name?.trim()) return alert('Nome é obrigatório.');
      if (m.score < 0) return alert('Score deve ser >= 0.');
    }
    this.save.emit(m);
  }

  levelClass(level: Level) {
    return { allow: 'info', review: 'warn', deny: 'danger' }[level];
  }

  patch(partial: Partial<Editable>) {
    this._model.update(m => (m ? ({ ...m, ...partial } as Editable) : m));
  }
}