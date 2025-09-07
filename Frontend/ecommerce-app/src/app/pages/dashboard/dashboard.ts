import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

type Level = 'allow' | 'review' | 'deny';

interface Row {
  accountHash: string;
  score: number;
  level: Level;
  reasons: string[];
  createdAt: string; // ISO string para fácil formatação
}

@Component({
  selector: 'app-cortex-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard {


    private token = environment.token;
  // --- dados simulados (pode trocar por chamada HTTP depois)
    private data = signal<Row[]>([]);

    // --- filtro
    filter = signal<string>('');

    readonly rows = computed<Row[]>(() => {
        const q = this.filter().trim().toLowerCase();

        if (!q) return this.data();

        return this.data().filter(r =>
            r.accountHash.toLowerCase().includes(q) ||
            r.level.toLowerCase().includes(q) ||
            r.reasons.some(reason => reason.toLowerCase().includes(q))
        );
    });

    // --- estatísticas para o "gráfico" (barras CSS)
    readonly stats = computed(() => {
        const list = this.data();
        const total = list.length || 1;
        const count = (lvl: Level) => list.filter(r => r.level === lvl).length;
        const allow = Math.round(count('allow') * 100 / total);
        const review = Math.round(count('review') * 100 / total);
        const deny = Math.round(count('deny') * 100 / total);
        return { allow, review, deny };
    });

    // Apenas para mostrar reatividade (poderia remover)
    constructor() {
        effect(() => {
        const s = this.stats();
        // eslint-disable-next-line no-console
        console.log(`Allow ${s.allow}% • Review ${s.review}% • Deny ${s.deny}%`);
        });

        this.getResponseFraud()
            .then((resp) => {


                this.data.update(value => resp);
                
                        
                console.log("JSON: "+ JSON.stringify(resp));
                console.log("DATA: "+ this.data);
            })
            .catch((err) => console.error(err));
    }

    trackByAccount = (_: number, row: Row) => row.accountHash;

    levelClass(level: Level): string {
        return {
            'allow': 'info',
            'review': 'warn',
            'deny': 'danger'
        }[level];
    }

    trackByReason = (_: number, reason: string) => reason;

    // (Opcional) mapeia algumas palavras-chave para cores de risco
    reasonClass(reason: string): string {
        const r = reason.toLowerCase();

        // exemplos de regras simples — ajuste às suas categorias reais
        if (r.includes('deny') || r.includes('fraud') || r.includes('chargeback') || r.includes('bot')) {
            return 'danger';
        }
        if (r.includes('velocity') || r.includes('first') || r.includes('new') || r.includes('anomaly')) {
            return 'warn';
        }
        if (r.includes('device') || r.includes('browser') || r.includes('ip') || r.includes('geo')) {
            return 'info';
        }
        // padrão
        return 'neutral';
    }




    async getResponseFraud(): Promise<any> {

        return await new Promise<void>((resolve, reject) => {

        fetch("http://localhost:8080/api/v1/fraud", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.token
            }
        })
        .then((resp) => {

            resp.json()
                .then((json) => {

                resolve(json)


                })
                .catch((err) => reject(err))

        })
        .catch((err) => reject(err));

        });
    }
}